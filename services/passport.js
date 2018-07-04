const passport = require('passport');
const User = require('../models/user');
const config = require('../config');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const localStrategy = require('passport-local');

// Create local strategy
const localOptions = {
    usernameField: 'email'
};
const localLogin = new localStrategy(localOptions, async function (email, password, done) {
    try {
        const user = await User.findOne({ email });
        if (!user) { return done(null, false)}

        // compare passwords
        user.comparePassword(password, function (err, isMatch) {
            if(err) { return done(); }
            if (!isMatch) { return done(null, false)}
            return done(null, user);
        });

    } catch(err) {
        done(err);
    }

});
// setup options for jwt strategy

const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromHeader('authorization'),
    secretOrKey: config.secret
};

// Create JWT strategy
const jwtLogin = new JwtStrategy(jwtOptions, function (payload, done) {
   User.findById(payload.sub, function (err, user) {
     if (err) { return done(err, false); }

     if(user) {
         done(null, user);
     } else {
         done(null, false);
     }

   });
});

// Tell passport to use this strategy
passport.use(jwtLogin);
passport.use(localLogin);
