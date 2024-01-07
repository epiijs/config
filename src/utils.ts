import path from 'path';
import { fileURLToPath } from 'url';

function getStringOrFallback(input: string | any, fallback: string): string {
  if (input && typeof input === 'string') {
    return input;
  }
  return fallback;
}

function getRecordOrFallback(input: object | any, fallback: Record<string, unknown>): Record<string, unknown> {
  if (input && typeof input === 'object') {
    return Object.assign({}, input) as Record<string, unknown>;
  }
  return fallback;
}

function getDirNameByImportMeta(meta: ImportMeta): string {
  const __filename = fileURLToPath(meta.url);
  const __dirname = path.dirname(__filename);
  return __dirname;
}

function getSafePathOrThrow(input: string): string {
  if (input.includes('..')) {
    throw new Error('path cannot contain ".."');
  }
  return input;
}

function getSafeFlagOrThrow(input: Record<string, unknown>): Record<string, unknown> {
  type FlagRuleFn = (value: unknown) => boolean;
  const flagRules: Record<string, FlagRuleFn> = {
    'verbose': () => true
  };
  const output: Record<string, unknown> = {};
  for (const key in input) {
    const rule = flagRules[key];
    if (!rule) {
      console.log(`config flags['${key}'] is ignored`);
      continue;
    }
    if (!rule(input[key])) {
      throw new Error(`config flags['${key}'] is refused`);
    }
    output[key] = input[key];
  }
  return output;
}

export {
  getStringOrFallback,
  getRecordOrFallback,
  getDirNameByImportMeta,
  getSafePathOrThrow,
  getSafeFlagOrThrow
}