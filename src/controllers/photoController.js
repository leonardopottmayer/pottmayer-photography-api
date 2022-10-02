require("dotenv").config();
const AWS = require("aws-sdk");
const uuid = require("uuid").v4;

const Post = require("../models/post");
const PostImage = require("../models/post-image");
const validateDocumentId = require("../helpers/validate-document-id");

// S3 access configuration
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ID,
  secretAccessKey: process.env.AWS_SECRET,
});

module.exports = {
  getAllPhotos: async (req, res) => {
    try {
      // Query images on MongoDB
      const query = await PostImage.find({});

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
  getPhotoById: async (req, res) => {
    const { photoId } = req.params;

    try {
      // Validate MongoDB document id
      let documentIdValidationResult = await validateDocumentId(photoId);

      if (documentIdValidationResult != "OK") {
        return res.status(400).json({
          message: documentIdValidationResult,
        });
      }
      // Query post on MongoDB
      const query = await PostImage.findById(photoId);

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
  postPhoto: async (req, res) => {
    const { postId } = req.params;

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

    if (!req.file) {
      return res.status(400).json({
        message: "You have to send a file!",
      });
    }

    // Get file buffer
    if (!req.file.buffer) {
      return res.status(400).json({
        message: "You have to send a file!",
      });
    }

    const fileBuffer = req.file.buffer;

    // Get original file name
    if (!req.file.originalname) {
      return res.status(400).json({
        message: "You have to send a file!",
      });
    }

    const fileName = req.file.originalname;

    try {
      // Set params
      const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: `${uuid()}-${new Date().getTime()}-${fileName}`,
        Body: fileBuffer,
      };

      // Send it to S3
      await s3.upload(params, (error, data) => {
        if (error) {
          return res.status(400).json({
            message: "An error ocurred while processing your request!",
            error: error,
          });
        }

        // Create MongoDB object
        const newPostImage = new PostImage({
          key: data.Key,
          url: data.Location,
          postedBy: req.userId,
          post: postId,
        });

        // Save on mongodb
        newPostImage.save((err, postImage) => {
          queryPost.photos.push(postImage);
          queryPost.save();
        });

        return res.status(200).json({
          message: "Successfully uploaded image!",
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
  deletePhoto: async (req, res) => {
    const { photoId } = req.params;

    try {
      // Validate MongoDB document id
      let documentIdValidationResult = await validateDocumentId(photoId);

      if (documentIdValidationResult != "OK") {
        return res.status(400).json({
          message: documentIdValidationResult,
        });
      }

      // Query post on MongoDB
      const queryPhoto = await PostImage.findById(photoId);

      if (!queryPhoto) {
        return res
          .status(400)
          .json({ message: "No photo found with this id!" });
      }

      // Delete from s3
      await s3.deleteObject(
        {
          Bucket: process.env.AWS_BUCKET_NAME,
          Key: queryPhoto.key,
        },
        function (error, data) {
          if (error) {
            return res.status(400).json({
              message: "An error ocurred while processing your request!",
              error: error,
            });
          }
        }
      );

      const post = await Post.findById({ _id: queryPhoto.post });
      await post.photos.pull(queryPhoto._id);
      await post.save();

      // Delete from MongoDB
      PostImage.findByIdAndRemove(photoId, (error) => {
        if (!error) {
          return res.status(200).json({
            message: "Successfully deleted image!",
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
};
