var mongoose = require('mongoose');
var User = require('./models/user-model');
mongoose.connect('mongodb://localhost/auth').then(function() {
  User.find(function(err, users) {
    for(let i = 0; i < users.length; i++) {
      console.log(users);
      //users[i].remove();
      users[i].portfolio += 'GOOG';
      //users[i].save();
    }
  });
 });
