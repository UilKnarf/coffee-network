const cloudinary = require("../middleware/cloudinary");
const Post = require("../models/Post");
const Comment = require("../models/Comment");
const axios = require("axios");

module.exports = {
  getProfile: async (req, res) => {
    try {
      const posts = await Post.find({ user: req.user.id });
      res.render("profile", { posts: posts, user: req.user });
    } catch (err) {
      res.status(500).send("An error occurred while fetching profile posts.");
    }
  },

  getFeed: async (req, res) => {
    try {
      const posts = await Post.find()
        .sort({ createdAt: "desc" })
        .populate("user")
        .lean();
      res.render("feed", { posts: posts, user: req.user });
    } catch (err) {
      res.status(500).send("Error fetching feed");
    }
  },

  getPost: async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);
      const comments = await Comment.find({ post: req.params.id })
        .sort({ createdAt: "desc" })
        .lean();
      res.render("post", {
        post: post,
        user: req.user,
        comments: comments,
        likedBy: post.likedBy,
      });
    } catch (err) {
      res.status(500).send("Error fetching the post");
    }
  },

  createPost: async (req, res) => {
    try {
      const result = await cloudinary.uploader.upload(req.file.path);
      await Post.create({
        title: req.body.title,
        image: result.secure_url,
        cloudinaryId: result.public_id,
        caption: req.body.caption,
        likes: 0,
        user: req.user.id,
      });
      res.redirect("/profile");
    } catch (err) {
      res.status(500).send("Error creating post");
    }
  },

  likePost: async (req, res) => {
    try {
      const postId = req.params.id;
      const userId = req.user.id;
      const post = await Post.findById(postId);

      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }

      if (post.likedBy.includes(userId)) {
        await Post.findOneAndUpdate(
          { _id: postId },
          {
            $inc: { likes: -1 },
            $pull: { likedBy: userId },
          }
        );

        console.log("Likes -1 (unliked)");
      } else {
        await Post.findOneAndUpdate(
          { _id: postId },
          {
            $inc: { likes: 1 },
            $push: { likedBy: userId },
          }
        );
      }

      res.redirect(`/post/${postId}`);
    } catch (err) {
      res.status(500).json({ message: "An error occurred while liking the post" });
    }
  },

  deletePost: async (req, res) => {
    try {
      const postId = req.params.id;
      const post = await Post.findById(postId);

      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }
      if (post.user.toString() !== req.user.id) {
        return res.status(403).json({ message: "You are not authorized to delete this post" });
      }

      await cloudinary.uploader.destroy(post.cloudinaryId);
      await Post.findByIdAndDelete(postId);
      res.redirect("/profile");
    } catch (err) {
      return res.status(500).json({ message: "An error occurred while deleting the post" });
    }
  },

  getDiscover: async (req, res) => {
    console.log("Inside getDiscover function");
    try {
      const location = "40.748817,-73.985428"; 
      const radius = 1500; 
      const type = "cafe";
      const googleAPIKey = process.env.GOOGLE_API_KEY;
      const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${location}&radius=${radius}&type=${type}&key=${googleAPIKey}`;
      const response = await axios.get(url);

      if (response.data.status === "OK") {
        const coffeeShops = response.data.results;
        res.render("discover", { coffeeShops: coffeeShops, user: req.user });
      } else {
        res.status(500).send("Error retrieving coffee shops");
      }
    } catch (err) {
      res.status(500).send("Error retrieving coffee shops");
    }
  },
};