const LocalStrategy = require("passport-local").Strategy;
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// Cargar el modelo de usuario
const User = require("../models/User");

module.exports = function (passport) {
  passport.use(
    new LocalStrategy({ usernameField: "email" }, (email, password, done) => {
      // Buscar usuario por email
      User.findOne({ email: email })
        .then((user) => {
          if (!user) {
            return done(null, false, { message: "No user found" });
          }

          // Comparar contraseña
          bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) throw err;
            if (isMatch) {
              return done(null, user);
            } else {
              return done(null, false, { message: "Password incorrect" });
            }
          });
        })
        .catch((err) => console.log(err));
    })
  );

  passport.use(
    new GoogleStrategy(
      {
        clientID: "YOUR_GOOGLE_CLIENT_ID",
        clientSecret: "YOUR_GOOGLE_CLIENT_SECRET",
        callbackURL: "/api/users/auth/google/callback",
      },
      (token, tokenSecret, profile, done) => {
        User.findOne({ googleId: profile.id }, (err, user) => {
          if (err) return done(err);
          if (user) {
            return done(null, user);
          } else {
            const newUser = new User({
              googleId: profile.id,
              name: profile.displayName,
              email: profile.emails[0].value,
            });
            newUser.save((err) => {
              if (err) return done(err);
              return done(null, newUser);
            });
          }
        });
      }
    )
  );

  passport.use(
    new FacebookStrategy(
      {
        clientID: "YOUR_FACEBOOK_APP_ID",
        clientSecret: "YOUR_FACEBOOK_APP_SECRET",
        callbackURL: "/api/users/auth/facebook/callback",
      },
      (token, tokenSecret, profile, done) => {
        User.findOne({ facebookId: profile.id }, (err, user) => {
          if (err) return done(err);
          if (user) {
            return done(null, user);
          } else {
            const newUser = new User({
              facebookId: profile.id,
              name: profile.displayName,
              email: profile.emails[0].value,
            });
            newUser.save((err) => {
              if (err) return done(err);
              return done(null, newUser);
            });
          }
        });
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
      done(err, user);
    });
  });
};
