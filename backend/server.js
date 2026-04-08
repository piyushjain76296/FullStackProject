const http = require('http');
const { Server } = require('socket.io');
const app = require('./src/app');
const env = require('./src/config/env');
const logger = require('./src/config/logger');
const { connectDB, disconnectDB } = require('./src/config/db');
const socketHandler = require('./src/socket');

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: env.CORS_ORIGIN,
    methods: ['GET', 'POST']
  }
});

socketHandler(io);

let serverInstance;
connectDB().then(() => {
  serverInstance = server.listen(env.PORT, () => {
    logger.info(`Server is running on port ${env.PORT} in ${env.NODE_ENV} mode`);
  });
});

const unexpectedErrorHandler = (error) => {
  logger.error(`Unexpected Error: ${error}`);
  if (serverInstance) {
    serverInstance.close(() => {
      logger.info('Server closed');
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);

process.on('SIGTERM', () => {
  logger.info('SIGTERM received');
  if (serverInstance) {
    serverInstance.close(() => {
      logger.info('Server closed');
      disconnectDB();
      process.exit(0);
    });
  }
});
