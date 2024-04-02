const express = require("express");
const user = require("../controller/user.controller");
const router = express.Router();

router.post("/signUp", user.userSignUp);
router.post("/login", user.userLogin);

module.exports = router;
