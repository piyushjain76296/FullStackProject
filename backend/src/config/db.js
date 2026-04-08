const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const env = require('./env');
const logger = require('./logger');

let mongoServer;

const connectDB = async () => {
  try {
    let uri = env.MONGODB_URI;

    if (!uri) {
      logger.info('No MONGODB_URI provided. Starting in-memory MongoDB server...');
      mongoServer = await MongoMemoryServer.create();
      uri = mongoServer.getUri();
      logger.info(`In-memory MongoDB started at: ${uri}`);
    }

    const conn = await mongoose.connect(uri);
    logger.info(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    logger.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

const disconnectDB = async () => {
    await mongoose.disconnect();
    if (mongoServer) {
        await mongoServer.stop();
    }
};

module.exports = { connectDB, disconnectDB };
