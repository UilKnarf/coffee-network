const LocalStrategy = require("passport-local").Strategy;
const mongoose = require("mongoose");
const User = require("../models/User");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const dotenv = require("dotenv");

dotenv.config();

module.exports = function (passport) {
  passport.use(
    new LocalStrategy({ usernameField: "email" }, async (email, password, done) => {
      try {
        const user = await User.findOne({
          $or: [
            { "regularUser.email": email.toLowerCase() },
            { "oauthUser.email": email.toLowerCase() }
          ]
        });

        if (!user) {
          return done(null, false, { msg: `Email ${email} not found.` });
        }

        if (user.regularUser && user.regularUser.password) {
          const isMatch = await user.regularUser.comparePassword(password); 
          if (isMatch) {
            return done(null, user);
          } else {
            return done(null, false, { msg: "Invalid email or password." });
          }
        }

        if (user.oauthUser) {
          return done(null, user);
        }
        return done(null, false, { msg: "Invalid email or password." });

      } catch (err) {
        console.error("Error during authentication:", err);
        return done(err);
      }
    })
  );

  passport.serializeUser((user, done) => {
    if (user.regularUser) {
      done(null, user.regularUser._id); 
    } else if (user.oauthUser) {
      done(null, user.oauthUser.googleId);
    }
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findOne({
        $or: [
          { "regularUser._id": id },
          { "oauthUser.googleId": id }
        ]
      });

      if (user) {
        done(null, user);
      } else {
        done(null, false);
      }
    } catch (err) {
      done(err, null);
    }
  });

  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "http://localhost:3000/auth/google/callback",
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          let user = await User.findOne({ googleId: profile.id });
          if (!user) {
            user = new User({
              googleId: profile.id,
              email: profile.emails[0].value,
              displayName: profile.displayName,
            });
            await user.save(); 
          }

          return done(null, user);
        } catch (err) {
          console.error("Google auth error:", err);
          return done(err);
        }
      }
    )
  );
};
