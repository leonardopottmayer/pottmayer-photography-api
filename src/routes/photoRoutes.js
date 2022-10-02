const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const multer = require("multer");

const verifyToken = require("../helpers/verify-token");

const storage = multer.memoryStorage({
  destination: (req, file, callback) => {
    callback(null, "");
  },
});

const upload = multer({ storage }).single("file");

router.use(bodyParser.urlencoded({ extended: true }));

const photoController = require("../controllers/photoController");

router.get("/", verifyToken, photoController.getAllPhotos);
router.get("/:photoId", verifyToken, photoController.getPhotoById);
router.post("/:postId", verifyToken, verifyToken, upload, photoController.postPhoto);
router.delete("/:photoId", verifyToken, photoController.deletePhoto);

module.exports = router;
