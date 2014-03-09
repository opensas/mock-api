var root = __dirname + '/../../';

var request = require('supertest');
var should  = require('chai').should();
var app     = require(root + 'app');

describe('mock API', function() {
  describe('usuarios/count resource', function() {

    it('usuarios should have 12 resources', function(done) {
      request(app)
        .get('/api/usuarios/count')
        .expect('Content-Type', /application\/json/)
        .expect('12')
        .expect(200, done)
      ;
    });

    it('should paginate the first page of resources', function(done) {
      request(app)
        .get('/api/usuarios?len=10&page=1')
        .end(function(err, res) {
          if (err) return done(err);          // should.not.exist(err);

          res.type.should.match(/json/);
          res.status.should.equal(200);
          res.body.length.should.equal(10);
          done();
        })
      ;
    });

    it('should paginate the second page of resources', function(done) {
      request(app)
        .get('/api/usuarios?len=10&page=2')
        .end(function(err, res) {
          if (err) return done(err);          // should.not.exist(err);

          res.type.should.match(/json/);
          res.status.should.equal(200);
          res.body.length.should.equal(2);
          done();
        })
      ;
    });

    it('should paginate the third page of resources', function(done) {
      request(app)
        .get('/api/usuarios?len=10&page=3')
        .end(function(err, res) {
          if (err) return done(err);          // should.not.exist(err);

          res.type.should.match(/json/);
          res.status.should.equal(200);
          res.body.length.should.equal(0);
          done();
        })
      ;
    });

  });
});
