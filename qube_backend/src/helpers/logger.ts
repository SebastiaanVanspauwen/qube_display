/* eslint-disable no-console */
export enum LogLevel {
  ALL, // 0
  INFO, // 1
  WARN, // 2
  ERROR, // 3
}

class Logger {
  public logLevel: LogLevel
  private readonly logLevels = Object.keys(LogLevel).map(level => LogLevel[level])

  constructor (logType: LogLevel) {
    this.logLevel = logType
  }

  all (...message: unknown[]): void {
    this.log(LogLevel.ALL, ...message)
  }

  info (...message: unknown[]): void {
    this.log(LogLevel.INFO, ...message)
  }

  warn (...message: unknown[]): void {
    this.log(LogLevel.WARN, ...message)
  }

  error (...message: unknown[]): void {
    this.log(LogLevel.ERROR, ...message)
  }

  log (level: LogLevel, ...message: unknown[]): void {
    // if message level is ALL (0), but we only require INFO (1) or greater, then don't log
    if (this.logLevels.indexOf(level) >= this.logLevels.indexOf(this.logLevel)) console.log(LogLevel[level], '|', new Date(), ':', ...message)
  }
}

export default Logger
