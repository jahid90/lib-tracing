const chalk = require('chalk');

const createLogger = (module, logLevel) => {
    const LogLevel = {
        DEBUG: 0,
        INFO: 1,
        WARN: 2,
        ERROR: 3,
        FATAL: 4,
        from: (logLevel) => {
            switch (logLevel) {
                case 'debug':
                    return LogLevel.DEBUG;
                case 'info':
                    return LogLevel.INFO;
                case 'warn':
                    return LogLevel.WARN;
                case 'error':
                    return LogLevel.ERROR;
                case 'fatal':
                    return LogLevel.FATAL;
                default:
                    return LogLevel.WARN;
            }
        },
    };

    const level = LogLevel.from(logLevel);

    return {
        debug: (...args) =>
            level <= LogLevel.DEBUG &&
            console.log(`${chalk.cyan('[' + module + ']')}] ${chalk.white('DEBUG')}`, ...args),
        info: (...args) =>
            level <= LogLevel.INFO && console.log(`[${chalk.cyan(module)}] ${chalk.green('INFO')}`, ...args),
        warn: (...args) =>
            level <= LogLevel.WARN && console.log(`[${chalk.cyan(module)}] ${chalk.yellow('WARN')}`, ...args),
        error: (...args) =>
            level <= LogLevel.ERROR && console.log(`[${chalk.cyan(module)}] ${chalk.red('ERROR')}`, ...args),
        fatal: (...args) =>
            level <= LogLevel.FATAL && console.log(`[${chalk.cyan(module)}] ${chalk.magenta('FATAL')}`, ...args),
    };
};

module.exports = createLogger;
