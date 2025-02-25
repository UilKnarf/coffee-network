const express = require('express');
const passport = require('passport');
const router = express.Router();
const authController = require('../controllers/auth');

router.get("/auth/google", passport.authenticate("google", {
    scope: ["profile", "email"], 
  }));
  

  router.get("/auth/google/callback", passport.authenticate("google", {
    failureRedirect: "/login",
    successRedirect: "/feed", 
  }));

module.exports = router;