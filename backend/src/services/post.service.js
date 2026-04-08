const axios = require('axios');
const Post = require('../models/Post');
const ApiError = require('../utils/ApiError');
const cache = require('../utils/cache');
const logger = require('../config/logger');

const syncPosts = async () => {
  try {
    const response = await axios.get('https://jsonplaceholder.typicode.com/posts');
    const posts = response.data;

    if (!posts || posts.length === 0) {
      throw new ApiError(404, 'No posts found to sync');
    }

    const bulkOps = posts.map(post => ({
      updateOne: {
        filter: { id: post.id },
        update: { $set: { userId: post.userId, id: post.id, title: post.title, body: post.body } },
        upsert: true
      }
    }));

    const result = await Post.bulkWrite(bulkOps);

    // Invalidate cache since new data arrived
    cache.clear();

    logger.info(`Synced posts. Upserted: ${result.upsertedCount}, Modified: ${result.modifiedCount}`);
    return { upsertedCount: result.upsertedCount, modifiedCount: result.modifiedCount };
  } catch (error) {
    logger.error(`Error syncing posts: ${error.message}`);
    throw new ApiError(500, 'Failed to sync external posts');
  }
};

const queryPosts = async (options) => {
  const { page = 1, limit = 10, sortBy = 'createdAt', order = 'desc' } = options;

  const cacheKey = `posts-${page}-${limit}-${sortBy}-${order}`;
  const cachedData = cache.get(cacheKey);

  if (cachedData) {
    return cachedData;
  }

  const skip = (page - 1) * limit;
  const sortOrder = order === 'desc' ? -1 : 1;

  const [posts, total] = await Promise.all([
    Post.find()
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(limit)
      .lean(),
    Post.countDocuments()
  ]);

  const result = {
    data: posts,
    meta: {
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / limit),
      totalResults: total
    }
  };

  cache.set(cacheKey, result);
  return result;
};

const getPostById = async (id) => {
  const post = await Post.findOne({ id }).lean();
  if (!post) {
    throw new ApiError(404, 'Post not found');
  }
  return post;
};

const searchPostsRealtime = async (query) => {
  if (!query || query.trim() === '') {
    return [];
  }
  
  // Realtime search text indexing
  const posts = await Post.find(
    { $text: { $search: query } },
    { score: { $meta: 'textScore' } }
  )
    .sort({ score: { $meta: 'textScore' } })
    .limit(20)
    .lean();

  return posts;
};

module.exports = {
  syncPosts,
  queryPosts,
  getPostById,
  searchPostsRealtime
};
