const { searchPostsRealtime } = require('../services/post.service');
const logger = require('../config/logger');

module.exports = (io) => {
  io.on('connection', (socket) => {
    logger.debug(`Socket connected: ${socket.id}`);

    socket.on('search:query', async (query) => {
      try {
        const results = await searchPostsRealtime(query);
        socket.emit('search:results', results);
      } catch (error) {
        logger.error(`Search socket error: ${error.message}`);
        socket.emit('search:error', { message: 'Failed to execute real-time search' });
      }
    });

    socket.on('typing:start', () => {
      socket.broadcast.emit('user:typing', true);
    });

    socket.on('typing:stop', () => {
      socket.broadcast.emit('user:typing', false);
    });

    socket.on('disconnect', () => {
      logger.debug(`Socket disconnected: ${socket.id}`);
    });
  });
};
