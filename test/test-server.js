var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../server.js');

var should = chai.should();
var app = server.app;

chai.use(chaiHttp);

describe('Server', function() {
  before(function(done) {
    app.listen(8080, () => console.log("test server running..."));
    done();
  });
    it('should respond with code 200 on root GET request', function(done) {
      chai.request(app)
          .get('localhost:8080')
          .end(function(err, res) {
            should.equal(err, null);
            res.should.have.status(200);
            res.should.be.html;
          });
    });
    it('should add an item on post');
    it('should edit an item on put');
    it('should delete an item on delete');
});
