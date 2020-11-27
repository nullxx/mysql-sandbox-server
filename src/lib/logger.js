


const winston = require('winston');

const __logger = winston.createLogger({
    level: process.env.LOGGING_BASE_LEVEL,
    format: winston.format.simple(),
    defaultMeta: { service: 'user-service' },
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: `${process.env.LOG_PATH}/error.log`, level: 'error' }),
        new winston.transports.File({ filename: `${process.env.LOG_PATH}/combined.log` }),
    ],
});

const log = (type, ...args) => {
    let log = '';
    for (let i = 0; i < args.length; i++) {
        const arg = args[i];
        log += '\n';
        if (i === args.length - 1 && typeof arg === 'object' && arg.user) {
            log = `USER: ${arg.user.id}${log}`;
        } else {
            log += `\t${arg}`;
        }
    }
    __logger.log(type, log);
}

module.exports = {
    log
};