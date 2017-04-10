module.exports = function(app, passport) {
var User = require('./models/user');
var path = require('path');

  // ======================================
  // HOME PAGE with login links (api endpoint)
  // ======================================
  app.get('/', function(req, res) {
    res.sendFile('index.html') //load index file.
  });

  // ======================================
  // LEADERBOARD
  // ======================================
  app.get('/leaderboard', function(req, res) {
    User.find({}, function(err, users) {
      var users = {users};
      console.log(users);
      res.render('leaderboard.ejs', users);
    });
  });

  // ======================================
  // LOGIN (api endpoint)
  // ======================================
  app.get('/login', function(req, res) {
    //render page and pass in flash data if it exists.
    res.render('login.ejs', { message: req.flash('loginMessage')});
  });

  //process login form
 app.post('/login',
  passport.authenticate('local-login'),
  function(req, res) {
    console.log('req: ', req.body)
    // If this function gets called, authentication was successful.
    // `req.user` contains the authenticated user.
    res.redirect('/profile');
  });

app.get('/guestLogin', function (req, res) {        
    res.render('guestLogin.ejs', { message: req.flash('loginMessage')});
});

  // ======================================
  // SIGNUP
  // ======================================
  app.get('/signup', function(req, res) {
    //render page and pass in any flash data if it exists.
    res.render('signup.ejs', { message: req.flash('signupMessage')});
  });

    //process signup form
    app.post('/signup', passport.authenticate('local-signup', {
      successRedirect: '/profile', //redirect to secure profile
      failureRedirect: '/signup', //redirect to signup page
      failureFlash: true // allow flash-messages.
    }));

  // ======================================
  // PROFILE SECTION
  // ======================================
  //create protected route to profile (user needs to be logged in).
  app.get('/profile', isLoggedIn, function(req, res) {
    //grab user from of session and pass to template
    var user = { user: req.user };
    res.render('profile.ejs', user);
  });

// ======================================
// USER UPDATE
// ======================================
  app.put('/user', isLoggedIn, function(req, res) {
    User.findByIdAndUpdate(req.body._id, {$set:req.body}, function(err, user) {
      user = req.body;
      if (err) {
        res.status(500).send(err);
      } else {
        res.status(200).send(user);
      }
    });
  });

  // ======================================
  // LOGOUT
  // ======================================
  app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
  });

  //route middleware to make sure a user is logged in.
  function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()) {
      return next();
    } else {
      res.redirect('/');
    }
  };

};
