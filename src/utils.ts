import path from 'path';
import { fileURLToPath } from 'url';

function getStringOrFallback(input: string | any, fallback: string): string {
  if (input && typeof input === 'string') { return input; }
  return fallback;
}

function getRecordOrFallback(input: object | any, fallback?: Record<string, unknown>): Record<string, unknown> {
  if (input && typeof input === 'object') {
    return Object.assign({}, input) as Record<string, unknown>;
  }
  return fallback || {};
}

function getDirNameByImportMeta(meta: ImportMeta): string {
  const __filename = fileURLToPath(meta.url);
  const __dirname = path.dirname(__filename);
  return __dirname;
}

export {
  getStringOrFallback,
  getRecordOrFallback,
  getDirNameByImportMeta
}