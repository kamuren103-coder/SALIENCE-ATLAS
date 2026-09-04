#!/usr/bin/env node

/**
 * Copy every user table from the read-only SQLite source into PostgreSQL.
 * The destination schema must already exist (run Prisma migration first).
 */

import { createRequire } from 'node:module';
import path from 'node:path';

const require = createRequire(import.meta.url);
const sqlite3 = require('sqlite3').verbose();
const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config({ path: process.env.DOTENV_CONFIG_PATH || '.env' });
if (!process.env.DATABASE_URL) {
  dotenv.config({ path: '.env.db01.local' });
}

const SQLITE_PATH = path.resolve(process.cwd(), 'data', 'salience_atlas.db');
const BATCH_SIZE = 500;

if (!process.env.DATABASE_URL) {
  console.error('DATABASE_URL is not set. Configure .env.db01.local before migrating.');
  process.exit(1);
}

const quoteIdentifier = (identifier) => `"${identifier.replace(/"/g, '""')}"`;
const sqlite = new sqlite3.Database(SQLITE_PATH, sqlite3.OPEN_READONLY);
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

function sqliteAll(sql, params = []) {
  return new Promise((resolve, reject) => {
    sqlite.all(sql, params, (error, rows) => error ? reject(error) : resolve(rows));
  });
}

async function getTables() {
  const rows = await sqliteAll(
    "SELECT name FROM sqlite_master WHERE type = 'table' AND name NOT LIKE 'sqlite_%' ORDER BY name"
  );
  return rows.map(({ name }) => name);
}

async function getColumns(table) {
  const rows = await sqliteAll(`PRAGMA table_info(${quoteIdentifier(table)})`);
  if (rows.length === 0) throw new Error(`SQLite table "${table}" has no columns`);
  return rows.map(({ name }) => name);
}

async function migrateTable(client, table) {
  const columns = await getColumns(table);
  const quotedTable = quoteIdentifier(table);
  const quotedColumns = columns.map(quoteIdentifier).join(', ');
  const placeholders = columns.map((_, index) => `$${index + 1}`).join(', ');
  const insert = `INSERT INTO ${quotedTable} (${quotedColumns}) VALUES (${placeholders}) ON CONFLICT DO NOTHING`;
  const rows = await sqliteAll(`SELECT ${quotedColumns} FROM ${quotedTable}`);

  for (let offset = 0; offset < rows.length; offset += BATCH_SIZE) {
    const batch = rows.slice(offset, offset + BATCH_SIZE);
    await client.query('BEGIN');
    try {
      for (const row of batch) {
        await client.query(insert, columns.map((column) => row[column]));
      }
      await client.query('COMMIT');
      console.log(`  ${table}: committed ${offset + batch.length}/${rows.length}`);
    } catch (error) {
      await client.query('ROLLBACK');
      throw new Error(`Migration failed for "${table}" at row ${offset}: ${error.message}`, { cause: error });
    }
  }
  return rows.length;
}

async function main() {
  const tables = await getTables();
  if (tables.length === 0) throw new Error('No user tables found in the SQLite source');

  const client = await pool.connect();
  let total = 0;
  try {
    console.log(`Migrating ${tables.length} SQLite tables to PostgreSQL`);
    for (const table of tables) total += await migrateTable(client, table);
    console.log(`Migration complete: ${total} rows copied`);
  } finally {
    client.release();
    await pool.end();
    sqlite.close();
  }
}

main().catch((error) => {
  console.error('Migration failed:', error.stack || error);
  process.exitCode = 2;
});
