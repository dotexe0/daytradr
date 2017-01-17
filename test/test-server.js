var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../server.js');

var should = chai.should();
var expect = chai.expect;
var app = server.app;

chai.use(chaiHttp);

// describe('Server', function() {
//     it('should respond with code 200 on root GET request', function(done) {
//       chai.request(app)
//           .get('/')
//           .end(function(err, res) {
//             should.equal(err, null);
//             res.should.have.status(200);
//             res.should.be.html;
//             done();
//           });
//     });
    //
    // it('should respond with 400 @ /user endpoint', function(done) {
    //   chai.request(app)
    //       .get('/profile')
    //       .end(function(err, res) {
    //         should.equal(err, null);
    //         res.should.have.status(201);
    //         res.should.be.json;
    //         done();
    //       });
    // });
// });

//
// var mongoose = require('mongoose');
// var User = require('./models/user-model');
// mongoose.connect('mongodb://localhost/daytradr').then(function() {
//  User.find(function(err, users) {
//   for(let i = 0; i < users.length; i++) {
//     console.log(users);
//     //users[i].remove();
//     //users[i].name = blablah;
//     //users[i].save();
//    }
//  });
//  });
