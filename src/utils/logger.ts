import { Colors, Logger } from 'logger';

//----------------------------------
// LOGGER
//----------------------------------
enum LogLevel {
  Debug,
  Error,
  Warn,
  Info
}

export enum LogType {
  Debug = 'debug',
  Info = 'info',
  Warn = 'warn',
  Error = 'error'
}

export const logger = new Logger({
  logLevel: LogLevel.Info,
  logProfiles: [
    {
      name: LogType.Debug,
      prefix: 'Debug',
      logLevel: LogLevel.Debug,
      prefixColor: Colors.BLUE,
      suffixColor: Colors.DARK_GREY
    },
    {
      name: LogType.Info,
      prefix: 'Info',
      logLevel: LogLevel.Info,
      prefixColor: Colors.GREEN,
      suffixColor: Colors.GREY
    },
    {
      name: LogType.Warn,
      prefix: 'Warn',
      logLevel: LogLevel.Warn,
      prefixColor: Colors.GOLD,
      suffixColor: Colors.GREY
    },
    {
      name: LogType.Error,
      prefix: 'Error',
      logLevel: LogLevel.Error,
      prefixColor: Colors.RED,
      suffixColor: Colors.DARK_RED
    }
  ]
});

