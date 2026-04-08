const mongoose = require('mongoose');

const postSchema = new mongoose.Schema(
  {
    userId: {
      type: Number,
      required: true,
      index: true
    },
    id: {
      type: Number,
      required: true,
      unique: true // Origin ID from JSONPlaceholder
    },
    title: {
      type: String,
      required: true,
      trim: true
    },
    body: {
      type: String,
      required: true,
      trim: true
    }
  },
  {
    timestamps: true
  }
);

// Text Index for optimized real-time search
postSchema.index({ title: 'text', body: 'text' });

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
