const mongoose = require("mongoose");

const Post = mongoose.model("Post", {
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  local: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  tags: {
    type: String,
    required: true,
  },
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  postedAt: {
    type: Date,
    default: Date.now(),
  },
  updatedAt: {
    type: Date,
    required: false,
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: false,
  },
  photos: [
    { type: mongoose.Schema.Types.ObjectId, ref: "PostImage", required: false },
  ],
});

module.exports = Post;
