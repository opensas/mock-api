var root = __dirname + '/../../';

var request = require('supertest');
var assert = require('assert');
var should = require('chai').should();
var app = require(root + 'app');

describe('mock API', function() {
  describe('usuarios/count resource', function() {

    it('should return the count of resources', function(done) {
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

    it('should ignore the len & page params', function(done) {
      request(app)
        .get('/api/usuarios/count?len=2&page=1')
        .expect('Content-Type', /application\/json/)
        .expect('12')
        .expect(200, done)
      ;
    });

    it('should take into account filters', function(done) {
      request(app)
        .get('/api/usuarios/count?q=ma')
        .expect('Content-Type', /application\/json/)
        .expect('2')
        .expect(200, done)
      ;
    });

    it('should work ok when no matching resources are found', function(done) {
      request(app)
        .get('/api/usuarios/count?q=xxx')
        .expect('Content-Type', /application\/json/)
        .expect('0')
        .expect(200, done)
      ;
    });

  });
});
