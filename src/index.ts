import { DeprecatedKeysOfMore } from './const';

interface IAppConfig {
  root: string;
  dirs: {
    source: string;
    target: string;
    client: string;
    server: string;
  };
  name: string;
  port: {
    client: number;
    server: number;
  };
  more: Record<string, unknown>;
}

interface IMaybeAppConfig {
  root: string;
  dirs?: {
    source?: string;
    target?: string;
    client?: string;
    server?: string;
  };
  name?: string;
  port?: string | number | {
    client?: string | number;
    server?: string | number;
  };
  more?: any;
}

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

function getAppConfigRoot(input: string | any): string {
  if (input && typeof input === 'string') { return input; }
  throw new Error('config.root must be a string');
}

function getAppConfigPort(input: string | number | any): IAppConfig['port'] {
  const isPortValue = (v: number): boolean => v > 0 && v < 65536;
  const result: IAppConfig['port'] = { client: 3000, server: 3001 };
  if (input) {
    if (typeof input === 'object') {
      const clientValue = Number(input.client);
      result.client = isPortValue(clientValue) ? clientValue : 3000;
      const serverValue = Number(input.server);
      result.server = isPortValue(serverValue) ? serverValue : result.client + 1;
    } else {
      const clientValue = Number(input);
      result.client = clientValue;
      result.server = clientValue + 1;
    }
  }
  return result;
}

function getAppConfigMore(input: any): Record<string, unknown> {
  const result = getRecordOrFallback(input);
  DeprecatedKeysOfMore.forEach(key => {
    if (result[key] != null) {
      console.log(`config.more.${key} is deprecated`);
    }
  });
  return result;
}

export function verifyConfig(config: IMaybeAppConfig | any): IAppConfig {
  if (!config || typeof config !== 'object') {
    throw new Error('config must be an object');
  }
  const verifiedConfig: Partial<IAppConfig> = {};
  verifiedConfig.root = getAppConfigRoot(config.root);
  const configDirs = getRecordOrFallback(config.dirs);
  verifiedConfig.dirs = {
    source: getStringOrFallback(configDirs.source, 'src'),
    target: getStringOrFallback(configDirs.target, 'build'),
    client: getStringOrFallback(configDirs.client, ''),
    server: getStringOrFallback(configDirs.server, '')
  };
  verifiedConfig.name = getStringOrFallback(config.name, 'unknown');
  verifiedConfig.port = getAppConfigPort(config.port);
  verifiedConfig.more = getAppConfigMore(config.more);
  return verifiedConfig as IAppConfig;
}

export default verifyConfig;

export type {
  IAppConfig,
  IMaybeAppConfig
};
