type TAppConfigMode = 'prod' | 'dev';

interface IAppConfigForCommon {
  root: string;

  mode: TAppConfigMode;

  dirs: {
    source: string;

    target: string;

    client: string;

    server: string;
  };
}

interface IAppConfigForServer {
  port: number;
}

interface IAppConfigForRender {
}

interface IAppConfig extends IAppConfigForCommon, IAppConfigForRender, IAppConfigForServer {}

function getAppConfigRoot(input: string | any): string {
  if (input && typeof input === 'string') { return input; }
  throw new Error('config.root must be a string');
}

function getAppConfigMode(input: string | any): TAppConfigMode {
  const typedInput = typeof input === 'string' ? input : process.env.NODE_ENV || '';
  return typedInput.toLowerCase().startsWith('dev') ? 'dev' : 'prod';
}

function getAppConfigDirs(input: string | any, fallback: string): string {
  if (input && typeof input === 'string') { return input; }
  return fallback;
}

function getAppConfigPort(input: number | any): number {
  if (typeof input === 'number' && input > 0 && input < 65536) { return input; }
  return Number(input) || 3001;
}

export function verifyConfig(config: Partial<IAppConfig> | any): IAppConfig {
  if (!config || typeof config !== 'object') {
    throw new Error('config must be an object');
  }
  const verifiedConfig: Partial<IAppConfig> = {};
  verifiedConfig.root = getAppConfigRoot(config.root);
  verifiedConfig.mode = getAppConfigMode(config.mode);
  verifiedConfig.dirs = {
    source: getAppConfigDirs(config.dirs?.source, 'src'),
    target: getAppConfigDirs(config.dirs?.target, 'build'),
    client: getAppConfigDirs(config.dirs?.client, ''),
    server: getAppConfigDirs(config.dirs?.server, '')
  };

  // verify server config
  verifiedConfig.port = getAppConfigPort(config.port);

  // verify render config
  // TODO

  return verifiedConfig as IAppConfig;
}

export type {
  IAppConfig
};

export default verifyConfig;