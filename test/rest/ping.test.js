var root = __dirname + '/../../';

var request = require('supertest');
var should = require('chai').should();
var app = require(root + 'app');

describe('mock API', function() {
  describe('ping resource', function() {

    it('should respond with pong', function(done) {
      request(app)
        .get('/api/ping')
        .expect('Content-Type', /text\/html/)
        .expect('pong')
        .expect(200, done)

/*        .end(function(err, res) {
          if (err) return done(err);
          should.not.exist(err);
          res.text.should.equal('pong');
          done();
        })
*/
      ;
    });

  });
});
