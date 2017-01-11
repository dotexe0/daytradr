module.exports = function(app, passport) {

  // ======================================
  // HOME PAGE with login links (api endpoint)
  // ======================================
  app.get('/', function(req, res) {
    res.render('index.html') //load index file.
  });

  // ======================================
  // LOGIN (api endpoint)
  // ======================================
  app.get('/login', function(req, res) {
    //render page and pass in flash data if it exists.
    res.render('login.ejs', { message: req.flash('loginMessage')});
  });

  //process login form
  app.post('/login', passport.authenticate('local-login', {
    successRedirect: '/profile',
    failureRedirect: '/login',
    failureFlash: true
  }));

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
  // USERS
  // ======================================
    //FIND USER AND UPDATE USING PUT

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
