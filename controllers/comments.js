const Comment = require("../models/Comment");

module.exports = {

  createComment: async (req, res) => {
    try {
      await Comment.create({
        comment: req.body.comment,
        likes: 0,
        post: req.params.id,
      });
      res.redirect("/post/" + req.params.id);
    } catch (err) {
      res.status(500).send("An error occurred while creating the comment");
    }
  },
};