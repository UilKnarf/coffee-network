const passport = require("passport");
const validator = require("validator");
const User = require("../models/User");
const { google } = require('googleapis');

exports.getLogin = (req, res) => {
  if (req.user) {
    return res.redirect("/profile");
  }
  res.render("login", {
    title: "Login",
  });
};

async function getGmailData(accessToken) {
  const oauth2Client = new google.auth.OAuth2();
  oauth2Client.setCredentials({ access_token: accessToken });
  const gmail = google.gmail({ version: 'v1', auth: oauth2Client });
  try {
    const res = await gmail.users.messages.list({ userId: 'me' });
  } catch (error) {
    console.error('Error fetching Gmail data:', error);
  }
}

exports.googleAuth = passport.authenticate("google", {
  scope: ["profile", "email"],
});

exports.googleCallback = [ 
  passport.authenticate('google', {
    failureRedirect: '/login',
  }),
  async (req, res) => {
    try {
      const existingUser = await User.findOne({ "oauthUser.googleId": req.user.id });

      if (existingUser) {
        return res.redirect("/feed");
      }

      const newOAuthUser = new User({
        oauthUser: {
          googleId: req.user.id,
          email: req.user.emails[0].value,
          displayName: req.user.displayName,
        }
      });

      await newOAuthUser.save();

      res.redirect("/feed");
    } catch (err) {
      res.status(500).send("Server error during user creation.");
    }
  }
];

exports.postLogin = (req, res, next) => {
  const validationErrors = [];
  if (!validator.isEmail(req.body.email))
    validationErrors.push({ msg: "Please enter a valid email address." });
  if (validator.isEmpty(req.body.password))
    validationErrors.push({ msg: "Password cannot be blank." });

  if (validationErrors.length) {
    req.flash("errors", validationErrors);
    return res.redirect("/login");
  }
  req.body.email = validator.normalizeEmail(req.body.email, {
    gmail_remove_dots: false,
  });

  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      req.flash("errors", info);
      return res.redirect("/login");
    }
    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }
      req.flash("success", { msg: "Success! You are logged in." });
      res.redirect(req.session.returnTo || "/profile");
    });
  })(req, res, next);
};

exports.logout = async (req, res) => {
  try {
    await new Promise((resolve) => {
      req.logout(() => {
        resolve();
      });
    });

    req.session.destroy((err) => {
      if (err) {
      }
      req.user = null;
      res.redirect("/");
    });
  } catch (err) {
    res.redirect("/");
  }
};
exports.getSignup = (req, res) => {
  if (req.user) {
    return res.redirect("/profile");
  }
  res.render("signup", {
    title: "Create Account",
  });
};

exports.postSignup = async (req, res, next) => {
  try {
    const validationErrors = [];

    req.body.userName = req.body.userName.trim();
    req.body.email = req.body.email.trim();

    if (!req.body.userName || req.body.userName.trim() === "") {
      return res.status(400).json({ error: "Username is required" });
    }   

    if (!req.body.email || !validator.isEmail(req.body.email)) {
      validationErrors.push({ msg: "Please enter a valid email address." });
    }

    if (!validator.isLength(req.body.password, { min: 8 })) {
      validationErrors.push({
        msg: "Password must be at least 8 characters long",
      });
    }
    if (req.body.password !== req.body.confirmPassword) {
      validationErrors.push({ msg: "Passwords do not match" });
    }

    if (validationErrors.length) {
      req.flash("errors", validationErrors);
      return res.redirect("../signup");
    }

    req.body.email = validator.normalizeEmail(req.body.email, {
      gmail_remove_dots: false,
    });

    const existingUser = await User.findOne({
      $or: [
        { email: req.body.email }, 
        { "regularUser.userName": req.body.userName }, 
      ],
    });

    if (existingUser) {
      req.flash("errors", {
        msg: "Account with that email address or username already exists.",
      });
      return res.redirect("../signup");
    }

    const user = new User({
      authMethod: "regular",
      regularUser: {
        userName: req.body.userName,
        email: req.body.email,
        password: req.body.password,
      },
    });

    // Save the user
    await user.save();

    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }
      res.redirect("/profile");
    });
  } catch (err) {
    console.error("Error in postSignup:", err);
    req.flash("errors", { msg: "An error occurred during signup. Please try again." });
    res.redirect("../signup");
  }
};
