const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;

const {
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  FACEBOOK_APP_ID,
  FACEBOOK_APP_SECRET,
  OAUTH_SUCCESS_REDIRECT,
  OAUTH_FAILURE_REDIRECT,
} = require('./env.config');

// ─── Google Strategy ──────────────────────────────────────────

if (GOOGLE_CLIENT_ID && GOOGLE_CLIENT_SECRET) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        callbackURL: '/api/auth/google/callback',
        scope: ['profile', 'email'],
      },
      (accessToken, refreshToken, profile, done) => {
        const email =
          profile.emails && profile.emails.length > 0
            ? profile.emails[0].value
            : null;

        done(null, {
          provider: 'google',
          providerId: profile.id,
          email,
          name: profile.displayName,
        });
      }
    )
  );
}

// ─── Facebook Strategy ────────────────────────────────────────

if (FACEBOOK_APP_ID && FACEBOOK_APP_SECRET) {
  passport.use(
    new FacebookStrategy(
      {
        clientID: FACEBOOK_APP_ID,
        clientSecret: FACEBOOK_APP_SECRET,
        callbackURL: '/api/auth/facebook/callback',
        profileFields: ['id', 'displayName', 'emails'],
      },
      (accessToken, refreshToken, profile, done) => {
        const email =
          profile.emails && profile.emails.length > 0
            ? profile.emails[0].value
            : null;

        done(null, {
          provider: 'facebook',
          providerId: profile.id,
          email,
          name: profile.displayName,
        });
      }
    )
  );
}

// Serialize/deserialize are not strictly needed for stateless JWT flow,
// but passport requires them to avoid warnings.
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj, done) => done(null, obj));

module.exports = passport;
