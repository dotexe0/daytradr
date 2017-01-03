"use strict";
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var config = require('./config');

var app = express();

app.use(bodyParser.json());
app.use(express.static('public'));

var runServer = function(callback) {
  mongoose.createConnection(config.DATABASE_URL, function(err) {
      if (err && callback) {
          return callback(err);
      }

      app.listen(config.PORT, function() {
          console.log('Listening on localhost:' + config.PORT);
          if (callback) {
              callback();
          }
      });
  });
};

if (require.main === module) {
  runServer(function(err) {
      if (err) {
          console.error(err);
      }
  });
};

// PASSPORT AUTH
//////
var passport = require('passport');
var BasicStrategy = require('passport-http').BasicStrategy;

var strategy = new BasicStrategy(function(username, password, callback) {
    User.findOne({
        username: username
    }, function (err, user) {
        if (err) {
            callback(err);
            return;
        }

        if (!user) {
            return callback(null, false, {
                message: 'Incorrect username.'
            });
        }

        user.validatePassword(password, function(err, isValid) {
            if (err) {
                return callback(err);
            }

            if (!isValid) {
                return callback(null, false, {
                    message: 'Incorrect password.'
                });
            }
            return callback(null, user);
        });
    });
});

passport.use(strategy);

/////////////////
var User = require('./models/user-model');
var bcrypt = require('bcryptjs');

var jsonParser = bodyParser.json();

app.post('/users', jsonParser, function(req, res) {
    if (!req.body) {
        return res.status(400).json({
            message: "No request body"
        });
    }

    if (!('username' in req.body)) {
        return res.status(422).json({
            message: 'Missing field: username'
        });
    }

    var username = req.body.username;

    if (typeof username !== 'string') {
        return res.status(422).json({
            message: 'Incorrect field type: username'
        });
    }

    username = username.trim();

    if (username === '') {
        return res.status(422).json({
            message: 'Incorrect field length: username'
        });
    }

    if (!('password' in req.body)) {
        return res.status(422).json({
            message: 'Missing field: password'
        });
    }

    var password = req.body.password;

    if (typeof password !== 'string') {
        return res.status(422).json({
            message: 'Incorrect field type: password'
        });
    }

    password = password.trim();

    if (password === '') {
        return res.status(422).json({
            message: 'Incorrect field length: password'
        });
    }

    //bcrypt
    bcrypt.genSalt(10, function(err, salt) {
        if (err) {
            return res.status(500).json({
                message: 'Internal server error'
            });
        }

        bcrypt.hash(password, salt, function(err, hash) {
            if (err) {
                return res.status(500).json({
                    message: 'Internal server error'
                });
            }

            var user = new User({
                username: username,
                password: hash
            });

            user.save(function(err) {
                if (err) {
                    return res.status(500).json({
                        message: 'Internal server error'
                    });
                }

                return res.status(201).json({});
            });
        });
    });
  });

mongoose.connect('mongodb://localhost/auth').then(function() {
//     // app.listen(process.env.PORT || 8080);
});

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname + '/public/index.html'));
});

// app.get('/dashboard', function(req, res) {
//   res.sendFile(path.join(__dirname + '/public/dashboard.html'))
// });

// prevent unathorized users from accessing the dashboard
app.use(passport.initialize());
app.get('/dashboard', passport.authenticate('basic', {session: false}), function(req, res) {
  res.sendFile(path.join(__dirname + '/public/dashboard.html'));
});

exports.app = app;
exports.runServer = runServer;
