const express = require('express');
const { z } = require('zod');
const postController = require('../controllers/post.controller');
const validate = require('../middlewares/validate');

const router = express.Router();

const getPostsSchema = {
  query: z.object({
    page: z.string().optional().default('1').transform(val => parseInt(val, 10)),
    limit: z.string().optional().default('10').transform(val => parseInt(val, 10)),
    sortBy: z.string().optional().default('createdAt'),
    order: z.enum(['asc', 'desc']).optional().default('desc'),
  })
};

const getPostSchema = {
  params: z.object({
    id: z.string().regex(/^\d+$/, 'ID must be an integer').transform(val => parseInt(val, 10)),
  })
};

router.post('/sync', postController.syncPosts);
router.get('/', validate(getPostsSchema), postController.getPosts);
router.get('/:id', validate(getPostSchema), postController.getPost);

module.exports = router;
