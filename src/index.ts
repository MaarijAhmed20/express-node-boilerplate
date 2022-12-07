import app from './app';
import config from './config/config';
import logger from './config/logger';
import { sequelize } from './database';
import * as http from 'http';

let server: http.Server = app.listen(config.port, () => {
  logger.info(`Listening to port ${config.port}`);
});
sequelize.sync({ force: false, alter: false }).then(() => {
  logger.info('DB Sync Completed');
});

const exitHandler = () => {
  if (server) {
    server.close(() => {
      logger.info('Server closed');
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

const unexpectedErrorHandler = (error: NodeJS.UncaughtExceptionListener | NodeJS.UnhandledRejectionListener) => {
  logger.error(error);
  exitHandler();
};

process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);

process.on('SIGTERM', () => {
  logger.info('SIGTERM received');
  if (server) {
    server.close();
  }
});
