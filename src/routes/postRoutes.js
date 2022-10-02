const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");

const verifyToken = require("../helpers/verify-token");

router.use(bodyParser.urlencoded({ extended: true }));

const postController = require("../controllers/postController");

router.get("/", postController.getAllPosts);
router.get("/all", postController.getAll);
router.get("/id/:postId", verifyToken, postController.getPostById);
router.post("/create", verifyToken, postController.createPost);
router.delete("/:postId", verifyToken, postController.deletePost);
router.patch("/:postId", verifyToken, postController.updatePost);

module.exports = router;
