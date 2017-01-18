//load required modules
var LocalStrategy = require('passport-local').Strategy;

//load user model
var User = require('../app/models/user');

//export module to expose it in our app
module.exports = function(passport) {
  // ======================
  // PASSPORT SESSION SETUP
  // ======================
  //required for persistent login sessions
  //passport needs ability to serialize and unserialize users out of sessions

  //serialize a user for a session
  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  //de-serialize user out of session
  passport.deserializeUser(function(id, done){
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });

  // ======================
  // LOCAL SIGNUP
  // ======================
  // we are using named strategies since we have one for login and one for signup.
  // by default, if there was no name, it would just be called 'local'

  passport.use('local-signup', new LocalStrategy({
    //by default, local strategy uses username and password -- we override username with email.
    usernameField : 'email',
    passwordField : 'password',
    passReqToCallback : true // allows us to pass entire request to callback,
  },
  function(req, email, password, done) {
    //asynch User.findOne wont fire unless data is sent back
    process.nextTick(function() {
      //find user whose email matches the forms
      User.findOne({ 'local.email' : email }, function(err, user) {
        if (user) {
          return done(null, false, req.flash('signupMessage', 'That email account already exists.'));
        } else {
          //if no user exists with that email, create new user
          var newUser = new User();
          newUser.local.email = email;
          newUser.local.password = newUser.generateHash(password);
          newUser.local.portfolio = {
            worth : 0,
            funds : 10000,
            stocks: {
              [""] : null
            }
          };

          //save new user to db
          newUser.save(function(err) {
            if(err) {
              throw err;
            } else {
              return done(null, newUser)
            }
          });
        }
      });
    });
  }));

  // ======================
  // LOCAL LOGIN
  // ======================

  passport.use('local-login', new LocalStrategy({
    usernameField : 'email',
    passwordField : 'password',
    passReqToCallback: true
  },
  function(req, email, password, done) {

    User.findOne({'local.email' : email }, function(err, user) {
    //if error, return message
    if (err) {
      return done(err);
    }
    //if no user found, return message
    if (!user) {
      return done(null, false, req.flash('loginMessage', 'No login found for that email address.'));
    }
    if(!user.validPassword(password)) {
      return done(null, false, req.flash('loginMessage', 'Wrong password!'));
    }
    return done(null, user);
  });
  }));

};
