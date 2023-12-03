interface IAppConfig {
  root: string;
  dirs: {
    source: string;
    target: string;
    client: string;
    server: string;
  };
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
  port?: number | {
    client?: number;
    server?: number;
  };
}

function getAppConfigRoot(input: string | any): string {
  if (input && typeof input === 'string') { return input; }
  throw new Error('config.root must be a string');
}

function getAppConfigDirs(input: string | any, fallback: string): string {
  if (input && typeof input === 'string') { return input; }
  return fallback;
}

function getAppConfigPort(input: number | any): IAppConfig['port'] {
  const isPortValue = (v?: number) => v && typeof v === 'number' && v > 0 && v < 65536;
  const result: IAppConfig['port'] = { client: 3000, server: 3001 };
  if (typeof input === 'object' && input) {
    result.client = isPortValue(input.client) ? input.client : 3000;
    result.server = isPortValue(input.server) ? input.server : result.client + 1;
  } else if (isPortValue(input)) {
    result.client = input;
    result.server = input + 1;
  }
  return result;
}

export function verifyConfig(config: IMaybeAppConfig | any): IAppConfig {
  if (!config || typeof config !== 'object') {
    throw new Error('config must be an object');
  }
  const verifiedConfig: Partial<IAppConfig> = {};
  verifiedConfig.root = getAppConfigRoot(config.root);
  verifiedConfig.dirs = {
    source: getAppConfigDirs(config.dirs?.source, 'src'),
    target: getAppConfigDirs(config.dirs?.target, 'build'),
    client: getAppConfigDirs(config.dirs?.client, ''),
    server: getAppConfigDirs(config.dirs?.server, '')
  };
  verifiedConfig.port = getAppConfigPort(config.port);
  return verifiedConfig as IAppConfig;
}

export default verifyConfig;

export type {
  IAppConfig,
  IMaybeAppConfig
};

/* more utilities */

type TAppConfigMode = 'prod' | 'dev';

function getAppConfigMode(input: string | any): TAppConfigMode {
  const typedInput = typeof input === 'string' ? input : process.env.NODE_ENV || '';
  return typedInput.toLowerCase().startsWith('dev') ? 'dev' : 'prod';
}

export {
  getAppConfigMode
};
