require("dotenv").config();

const Post = require("../models/post");
const PostImage = require("../models/post-image");
const validatePostData = require("../helpers/validate-post-data");
const validateDocumentId = require("../helpers/validate-document-id");

module.exports = {
  getAllPosts: async (req, res) => {
    try {
      // Query post on MongoDB
      const query = await Post.find({});

      return res
        .status(200)
        .json({ message: "Successfully completed query!", result: query });
    } catch (error) {
      console.log(error);
      return res.status(400).json({
        message: "An error ocurred while processing your request!",
        error: error,
      });
    }
  },
  getPostById: async (req, res) => {
    const { postId } = req.params;

    try {
      // Validate MongoDB document id
      let documentIdValidationResult = await validateDocumentId(postId);

      if (documentIdValidationResult != "OK") {
        return res.status(400).json({
          message: documentIdValidationResult,
        });
      }
      // Query post on MongoDB
      const query = await Post.findById(postId);

      return res
        .status(200)
        .json({ message: "Successfully completed query!", result: query });
    } catch (error) {
      console.log(error);
      return res.status(400).json({
        message: "An error ocurred while processing your request!",
        error: error,
      });
    }
  },
  createPost: async (req, res) => {
    const { title, description, local, date, tags } = req.body;

    try {
      // Validate data before sending to S3
      let postValidationResult = await validatePostData({
        title,
        description,
        local,
        date,
        tags,
      });

      if (postValidationResult != "OK") {
        return res.status(400).json({
          message: postValidationResult,
        });
      }

      // Create MongoDB object
      const newPost = new Post({
        title,
        description,
        local,
        date,
        tags,
      });

      // Save on mongodb
      newPost.save((err, post) => {
        return res.status(200).json({
          message: "Successfully created post!",
          post: post,
        });
      });
    } catch (error) {
      console.log(error);
      return res.status(400).json({
        message: "An error ocurred while processing your request!",
        error: error,
      });
    }
  },
  deletePost: async (req, res) => {
    const { postId } = req.params;

    try {
      // Validate MongoDB document id
      let documentIdValidationResult = await validateDocumentId(postId);

      if (documentIdValidationResult != "OK") {
        return res.status(400).json({
          message: documentIdValidationResult,
        });
      }

      // Query post on MongoDB
      const queryPost = await Post.findById(postId);

      if (!queryPost) {
        return res.status(400).json({ message: "No post found with this id!" });
      }

      const allPostPhotos = await PostImage.find({ post: postId });
      if (allPostPhotos.length > 0) {
        return res.status(400).json({
          message:
            "This post has images linked to it. Please delete those images before deleting the post!",
        });
      }

      // Delete from MongoDB
      Post.findByIdAndRemove(postId, (error) => {
        if (!error) {
          return res.status(200).json({
            message: "Successfully deleted post!",
          });
        } else {
          return res.status(400).json({
            message: "An error ocurred while processing your request!",
          });
        }
      });
    } catch (error) {
      console.log(error);
      return res.status(400).json({
        message: "An error ocurred while processing your request!",
        error: error,
      });
    }
  },
  updatePost: async (req, res) => {
    const { title, description, local, date, tags } = req.body;
    const { postId } = req.params;

    try {
      // Validate MongoDB document id
      let documentIdValidationResult = await validateDocumentId(postId);

      if (documentIdValidationResult != "OK") {
        return res.status(400).json({
          message: documentIdValidationResult,
        });
      }

      // Validate data
      let postValidationResult = await validatePostData({
        title,
        description,
        local,
        date,
        tags,
      });

      if (postValidationResult != "OK") {
        return res.status(400).json({
          message: postValidationResult,
        });
      }

      // Query post on MongoDB
      const queryPost = await Post.findById(postId);

      if (!queryPost) {
        return res.status(400).json({ message: "No post found with this id!" });
      }

      await Post.findOneAndUpdate(
        { _id: postId },
        {
          $set: {
            title: title,
            description: description,
            local: local,
            date: date,
            tags: tags,
            updatedAt: Date.now(),
            updatedBy: req.userId,
          },
        }
      );

      return res.status(200).json({ message: "Successfully updated post!" });
    } catch (error) {
      console.log(error);
      return res.status(400).json({
        message: "An error ocurred while processing your request!",
        error: error,
      });
    }
  },
  getAll: async (req, res) => {
    try {
      // Query post on MongoDB
      const posts = await Post.find({});

      for (let i = 0; i < posts.length; i++) {
        const post = posts[i];
        const photos = await PostImage.find({ post: post._id });
        post.photos = photos;
      }

      for (
        var j, x, i = posts.length;
        i;
        j = Math.floor(Math.random() * i),
          x = posts[--i],
          posts[i] = posts[j],
          posts[j] = x
      );

      return res
        .status(200)
        .json({ message: "Successfully completed query!", result: posts });
    } catch (error) {
      console.log(error);
      return res.status(400).json({
        message: "An error ocurred while processing your request!",
        error: error,
      });
    }
  },
};
