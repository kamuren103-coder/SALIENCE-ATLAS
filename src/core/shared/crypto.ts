import { randomBytes, createHash } from 'node:crypto';
import { v4 as uuidv4 } from 'uuid';

export function generateId(prefix = 'id'): string {
  return `${prefix}_${uuidv4().replace(/-/g, '').slice(0, 16)}`;
}

export function generateShortId(prefix = 'id'): string {
  return `${prefix}_${randomBytes(4).toString('hex')}`;
}

export function generateHash(data: string | object): string {
  const content = typeof data === 'string' ? data : JSON.stringify(data);
  return createHash('sha256').update(content).digest('hex');
}
