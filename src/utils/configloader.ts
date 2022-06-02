import { LogType, logger } from './logger';

import { readFileSync } from 'fs';

type pipe = {
  host: string;
  port: number;
};

type pipeConfig = {
  [key: string]: pipe;
};

class Config {
  readonly port: number;
  readonly defaultTarget: string;
  readonly defaultPipe: pipe;
  readonly pipes: pipeConfig = {};
  constructor(cfg: {
    port?: number;
    pipes?: pipeConfig;
    defaultTarget: string;
  }) {
    this.port = cfg.port ?? 80;
    this.defaultTarget = cfg.defaultTarget ?? null;
    if (cfg.pipes) this.pipes = cfg.pipes;
    if (this.pipes['*']) {
      this.defaultPipe = this.pipes['*'];
      delete this.pipes['*'];
    } else {
      this.defaultPipe = { host: this.defaultTarget, port: 8080 };
    }
  }

  public getPipeForSubDomain(subDomain?: string | null): pipe {
    if (!subDomain) return this.defaultPipe;

    for (const subRegex of Object.keys(this.pipes)) {
      const regex = new RegExp(subRegex);
      if (regex.test(subDomain)) return this.pipes[subRegex];
    }

    return this.defaultPipe;
  }
}

export const configLoader = (path: string = './config.json'): Config | null => {
  let config: Config | null = null;

  try {
    const data = JSON.parse(readFileSync(path, 'utf8'));
    if (!data.defaultTarget) {
      logger.log(LogType.Warn, 'Default target not defined in config');
      return null;
    }
    config = new Config(data);
  } catch (error) {
    console.log(error);
  }
  return config;
};
