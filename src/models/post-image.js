const mongoose = require("mongoose");

const PostImage = mongoose.model("PostImage", {
  key: {
    type: String,
    required: true,
  },
  url: {
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
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post",
  },
});

module.exports = PostImage;
