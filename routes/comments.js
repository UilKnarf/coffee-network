const express = require("express");
const router = express.Router();
const commentsController = require("../controllers/comments");
const { ensureAuth, ensureGuest } = require("../middleware/auth");

//Comment Routes - simplified for now
// router.post("/createComment/:id", commentsController.createcomment); old code 
router.post("/createComment/:id", commentsController.createComment); // new code

module.exports = router;