type TAppConfigMode = 'prod' | 'dev';

interface IAppConfigForCommon {
  root: string;

  mode: TAppConfigMode;

  dirs: {
    source: string;

    target: string;
  };
}

interface IAppConfigForServer {
  port: number;
}

interface IAppConfigForRender {
}

interface IAppConfig extends IAppConfigForCommon, IAppConfigForRender, IAppConfigForServer {}

function getAppConfigRoot(input: any): string {
  if (input && typeof input === 'string') { return input; }
  throw new Error('config.root must be a string');
}

function getAppConfigMode(input: any): TAppConfigMode {
  const typedInput = typeof input === 'string' ? input : process.env.NODE_ENV || '';
  return typedInput.toLowerCase().startsWith('dev') ? 'dev' : 'prod';
}

function getAppConfigDirs(input: any, fallback: string): string {
  if (input && typeof input === 'string') { return input; }
  return fallback;
}

function getAppConfigPort(input: any): number {
  if (typeof input === 'number') { return input; }
  return 0;
}

export function verifyConfig(config: any): IAppConfig {
  if (!config || typeof config !== 'object') {
    throw new Error('config must be an object');
  }
  const verifiedConfig: Partial<IAppConfig> = {};
  verifiedConfig.root = getAppConfigRoot(config.root);
  verifiedConfig.mode = getAppConfigMode(config.mode);
  verifiedConfig.dirs = {
    source: getAppConfigDirs(config.dirs?.source, 'src'),
    target: getAppConfigDirs(config.dirs?.target, 'build')
  };

  // verify server config
  if (typeof config.port === 'number') {
    // port = 0 means auto port discovery
    verifiedConfig.port = getAppConfigPort(config.port);
  }

  // verify render config
  // TODO

  return verifiedConfig as IAppConfig;
}

export type {
  IAppConfig
}

export default verifyConfig