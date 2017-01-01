var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../server.js');

var should = chai.should();
var expect = chai.expect;
var app = server.app;

chai.use(chaiHttp);

describe('Server', function() {
    it('should respond with code 200 on root GET request', function(done) {
      chai.request(app)
          .get('/')
          .end(function(err, res) {
            should.equal(err, null);
            res.should.have.status(200);
            res.should.be.html;
            done();
          });
    });
});
