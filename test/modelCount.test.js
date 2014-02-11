var root = __dirname + '/../';

var request = require('supertest');
var assert = require('assert');
var should = require('chai').should();
var app = require(root + 'app');

describe('mock API', function() {
  describe('usuarios/count resource', function() {

    it('should respond with pong', function(done) {
      request(app)
        .get('/api/usuarios/count')
        .expect('Content-Type', /application\/json/)
        .expect('12')
        .expect(200, done)

/*        .end(function(err, res) {
          if (err) return done(err);
          should.not.exist(err);
          // assert.equal(res.text, 'pong');
          res.text.should.equal('pong');
          done();
        })
*/
      ;
    });

  });
});
