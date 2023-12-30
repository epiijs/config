import {
  getDirNameByImportMeta,
  getRecordOrFallback,
  getStringOrFallback
} from './utils.js';

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
}

function getAppConfigRoot(input: string | any): string {
  if (input && typeof input === 'string') {
    return input;
  }
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
  return verifiedConfig as IAppConfig;
}

export default verifyConfig;

export {
  getDirNameByImportMeta
};

export type {
  IAppConfig,
  IMaybeAppConfig
};
