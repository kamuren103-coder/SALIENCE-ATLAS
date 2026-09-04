#!/usr/bin/env node

/**
 * Validate that PostgreSQL contains the same user tables and row counts
 * as the read-only SQLite source.
 */

import { createRequire } from 'node:module';
import path from 'node:path';

const require = createRequire(import.meta.url);
const sqlite3 = require('sqlite3').verbose();
const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config({ path: process.env.DOTENV_CONFIG_PATH || '.env' });
if (!process.env.DATABASE_URL) dotenv.config({ path: '.env.db01.local' });

const SQLITE_PATH = path.resolve(process.cwd(), 'data', 'salience_atlas.db');
const quoteIdentifier = (identifier) => `"${identifier.replace(/"/g, '""')}"`;

if (!process.env.DATABASE_URL) {
  console.error('DATABASE_URL is not set. Configure .env.db01.local before validating.');
  process.exit(1);
}

const sqlite = new sqlite3.Database(SQLITE_PATH, sqlite3.OPEN_READONLY);
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

function sqliteAll(sql) {
  return new Promise((resolve, reject) => {
    sqlite.all(sql, (error, rows) => error ? reject(error) : resolve(rows));
  });
}

async function sourceTables() {
  const rows = await sqliteAll(
    "SELECT name FROM sqlite_master WHERE type = 'table' AND name NOT LIKE 'sqlite_%' ORDER BY name"
  );
  return rows.map(({ name }) => name);
}

async function sourceCount(table) {
  const rows = await sqliteAll(`SELECT COUNT(*) AS count FROM ${quoteIdentifier(table)}`);
  return Number(rows[0].count);
}

async function destinationTables(client) {
  const result = await client.query(
    "SELECT tablename AS name FROM pg_catalog.pg_tables WHERE schemaname = 'public' ORDER BY tablename"
  );
  return result.rows.map(({ name }) => name);
}

async function validate() {
  const client = await pool.connect();
  try {
    const source = await sourceTables();
    const destination = new Set(await destinationTables(client));
    let passed = true;

    console.log(`Validating ${source.length} SQLite tables`);
    for (const table of source) {
      if (!destination.has(table)) {
        console.error(`FAIL ${table}: destination table is missing`);
        passed = false;
        continue;
      }
      const expected = await sourceCount(table);
      const actual = Number((await client.query(`SELECT COUNT(*) AS count FROM ${quoteIdentifier(table)}`)).rows[0].count);
      const status = expected === actual ? 'PASS' : 'FAIL';
      console.log(`${status} ${table}: SQLite=${expected} PostgreSQL=${actual}`);
      if (expected !== actual) passed = false;
    }

    const constraints = await client.query(
      "SELECT COUNT(*) AS count FROM pg_constraint WHERE contype = 'f'"
    );
    console.log(`PASS foreign-key constraints query (${constraints.rows[0].count} constraints found)`);
    console.log(passed ? 'ALL VALIDATIONS PASSED' : 'VALIDATION FAILED');
    return passed;
  } finally {
    client.release();
    await pool.end();
    sqlite.close();
  }
}

validate().then((passed) => {
  process.exitCode = passed ? 0 : 1;
}).catch((error) => {
  console.error('Validation failed:', error.stack || error);
  process.exitCode = 2;
});
