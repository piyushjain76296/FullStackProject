const postService = require('../services/post.service');
const ApiResponse = require('../utils/ApiResponse');

const syncPosts = async (req, res, next) => {
  try {
    const result = await postService.syncPosts();
    res.status(200).send(new ApiResponse(200, result, 'Posts synched successfully'));
  } catch (error) {
    next(error);
  }
};

const getPosts = async (req, res, next) => {
  try {
    const options = {
      page: req.query.page,
      limit: req.query.limit,
      sortBy: req.query.sortBy,
      order: req.query.order
    };
    const result = await postService.queryPosts(options);
    res.status(200).send(new ApiResponse(200, result, 'Posts retrieved successfully'));
  } catch (error) {
    next(error);
  }
};

const getPost = async (req, res, next) => {
  try {
    const post = await postService.getPostById(Number(req.params.id));
    res.status(200).send(new ApiResponse(200, post, 'Post retrieved successfully'));
  } catch (error) {
    next(error);
  }
};

module.exports = {
  syncPosts,
  getPosts,
  getPost
};
