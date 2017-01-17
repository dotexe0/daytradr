//load all modules
var express = require('express');
var app = express();
var port = process.env.PORT || 8080;
var mongoose = require('mongoose');
var passport = require('passport');
var flash = require('connect-flash');

var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');

var configDB = require('./config/database.js')

//configure database
mongoose.connect(configDB.url) // connect to database.

require('./config/passport')(passport);

//set up express application
app.use(morgan('dev')); //log every request to console.
app.use(cookieParser()); // read cookies (needed for authentication).
app.use(express.static('views')); //allow access to static files (img/css/js)
app.use(bodyParser()); //get info from html forms.
  app.use(bodyParser.urlencoded({ extended: true }));

app.set('view engine', 'ejs'); //set up ejs for templating.

//required for passport
app.use(session({ secret: 'letmein', saveUninitialized: true, resave: true }));
app.use(passport.initialize());
app.use(passport.session()); //persistent login sessions.
app.use(flash()); // use connect-flash for flash messages stored in session.

//routes
require('./app/routes.js')(app, passport); //load routes and pass into app with fully configured passport.

//launch server
app.listen(port);
console.log('Server running on' , port);
exports.app = app;
