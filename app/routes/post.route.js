const express = require("express");
const post = require("../controller/post.controller");
const router = express.Router();
const PostValidator = require("../validator/post.validator")
const upload = require('../config/multer')

router.post("/", upload.single('image'), PostValidator.store, post.postStore);
router.get("/view/:id", post.postView);

router.get("/search", PostValidator.search, post.postSearch);

router.get("/list", post.postList);

router.post("/comment", post.postCreateComment);

module.exports = router;