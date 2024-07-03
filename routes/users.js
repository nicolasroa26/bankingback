const express = require("express");
const router = express.Router();
const passport = require("passport");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { check, validationResult } = require("express-validator");

const User = require("../models/User");

// Función para generar JWT
const generateToken = (user) => {
  const payload = { id: user.id, name: user.name };
  return jwt.sign(payload, process.env.JWT_SECRET || "secret", {
    expiresIn: 3600,
  });
};

// @route   POST api/users/register
// @desc    Register user
// @access  Public
router.post(
  "/register",
  [
    check("name", "Name is required").not().isEmpty(),
    check("email", "Please include a valid email").isEmail(),
    check("password", "Password must be 6 or more characters").isLength({
      min: 6,
    }),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;

    User.findOne({ email })
      .then((user) => {
        if (user) return res.status(400).json({ msg: "Email already exists" });

        const newUser = new User({ name, email, password });

        bcrypt.genSalt(10, (err, salt) => {
          if (err) throw err;
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser
              .save()
              .then((user) => res.json(user))
              .catch((err) =>
                res.status(500).json({ msg: "Error saving user" })
              );
          });
        });
      })
      .catch((err) => res.status(500).json({ msg: "Error checking user" }));
  }
);

// @route   POST api/users/login
// @desc    Login user
// @access  Public
router.post(
  "/login",
  [
    check("email", "Please include a valid email").isEmail(),
    check("password", "Password is required").exists(),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    User.findOne({ email })
      .then((user) => {
        if (!user) return res.status(404).json({ msg: "User not found" });

        bcrypt
          .compare(password, user.password)
          .then((isMatch) => {
            if (!isMatch)
              return res.status(400).json({ msg: "Invalid credentials" });

            const token = generateToken(user);
            res.json({ token: `Bearer ${token}` });
          })
          .catch((err) =>
            res.status(500).json({ msg: "Error comparing passwords" })
          );
      })
      .catch((err) => res.status(500).json({ msg: "Error finding user" }));
  }
);

// Google OAuth
router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    res.redirect("/dashboard");
  }
);

// Facebook OAuth
router.get(
  "/auth/facebook",
  passport.authenticate("facebook", { scope: ["email"] })
);

router.get(
  "/auth/facebook/callback",
  passport.authenticate("facebook", { failureRedirect: "/" }),
  (req, res) => {
    res.redirect("/dashboard");
  }
);

module.exports = router;
