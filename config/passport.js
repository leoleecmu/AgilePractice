//FYI-http://www.passportjs.org/docs/basic-digest/
//passport allow uesr to login with other social media account
var passport = require('passport');
//The most widely used way for websites to authenticate users is via a username and password. Support for this mechanism is provided by the passport-local module.
var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/user');

// serialize and deserialize
passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

// middleware
/*
local-login is the name we give to the middleware
done is a callback that you need to call once you are done with your work. As you can see it is given in the first line of your code:

Verify Callback
This example introduces an important concept. Strategies require what is known as a verify callback. The purpose of a verify callback is to find the user that possesses a set of credentials.

When Passport authenticates a request, it parses the credentials contained in the request. It then invokes the verify callback with those credentials as arguments, in this case username and password. If the credentials are valid, the verify callback invokes done to supply Passport with the user that authenticated.

return done(null, user);
If the credentials are not valid (for example, if the password is incorrect), done should be invoked with false instead of a user to indicate an authentication failure.

return done(null, false);
An additional info message can be supplied to indicate the reason for the failure. This is useful for displaying a flash message prompting the user to try again.

return done(null, false, { message: 'Incorrect password.' });
Finally, if an exception occurred while verifying the credentials (for example, if the database is not available), done should be invoked with an error, in conventional Node style.

return done(err);
Note that it is important to distinguish the two failure cases that can occur. The latter is a server exception, in which err is set to a non-null value. Authentication failures are natural conditions, in which the server is operating normally. Ensure that err remains null, and use the final argument to pass additional details.
*/

passport.use('local-login', new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true
}, function(req, email, password, done) {
  User.findOne({ email: email}, function(err, user) {
    if (err) return done(err);

    if (!user) {
      return done(null, false, req.flash('loginMessage', 'No user has been found'));
    }

    if (!user.comparePassword(password)) {
      return done(null, false, req.flash('loginMessage', 'Oops! Wrong Password pal'));
    }
    return done(null, user);
  });
}));

//custom function to validate
exports.isAuthenticated = function(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
}
