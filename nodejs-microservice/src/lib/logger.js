const winston = require('winston');

const logger = winston.createLogger({
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
  let logStr = '';
  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i];
    logStr += '\n';
    logStr += `\t${arg}`;
  }
  logger.log(type, logStr);
};

module.exports = {
  log,
};
