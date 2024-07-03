const GoogleStrategy = require("passport-google-oauth20").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;
const User = require("../models/User");

module.exports = function (passport) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "/api/users/auth/google/callback",
      },
      (token, tokenSecret, profile, done) => {
        User.findOne({ googleId: profile.id })
          .then((user) => {
            if (user) {
              return done(null, user);
            } else {
              const newUser = new User({
                googleId: profile.id,
                name: profile.displayName,
                email: profile.emails[0].value,
              });
              newUser
                .save()
                .then((user) => done(null, user))
                .catch((err) => done(err, false));
            }
          })
          .catch((err) => done(err, false));
      }
    )
  );

  passport.use(
    new FacebookStrategy(
      {
        clientID: process.env.FACEBOOK_APP_ID,
        clientSecret: process.env.FACEBOOK_APP_SECRET,
        callbackURL: "/api/users/auth/facebook/callback",
        profileFields: ["id", "displayName", "emails"],
      },
      (token, tokenSecret, profile, done) => {
        User.findOne({ facebookId: profile.id })
          .then((user) => {
            if (user) {
              return done(null, user);
            } else {
              const newUser = new User({
                facebookId: profile.id,
                name: profile.displayName,
                email: profile.emails[0].value,
              });
              newUser
                .save()
                .then((user) => done(null, user))
                .catch((err) => done(err, false));
            }
          })
          .catch((err) => done(err, false));
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
