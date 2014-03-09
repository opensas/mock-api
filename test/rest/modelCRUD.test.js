var root = __dirname + '/../../';

var request = require('supertest');
var assert  = require('assert');
var should  = require('chai').should();
var app     = require(root + 'app');

var httpStatus = require(root + 'lib/web/httpStatus');

describe('mock API', function() {
  describe('usuarios resource', function() {

    it('should have 12 resources', function(done) {
      expectCount('usuarios', 12, done);
    });

    var newResource = {
      nombre:   "new name",
      apellido: "new surname",
      edad:     4
    };

    it('should add a new resource', function(done) {
      request(app)
        .post('/api/usuarios')
        .set('Content-Type', 'application/json')
        .send(newResource)
        .end(function(err, res) {
          if (err) return done(err);          // should.not.exist(err);

          res.type.should.match(/json/);
          res.status.should.equal(httpStatus.CREATED);
          res.body.should.eql({
            id:       13,
            nombre:   "new name",
            apellido: "new surname",
            edad:     4
          });
          done();
        })
      ;
    });

    it('should have 13 resources', function(done) {
      expectCount('usuarios', 13, done);
    });

    it('should get the new resource', function(done) {
      request(app)
        .get('/api/usuarios/13')
        .end(function(err, res) {
          if (err) return done(err);          // should.not.exist(err);

          res.type.should.match(/json/);
          res.status.should.equal(httpStatus.OK);
          res.body.should.eql({
            id:       13,
            nombre:   "new name",
            apellido: "new surname",
            edad:     4
          });
          done();
        })
      ;
    });

    var existingResource = {
      nombre:   "modified name",
      edad:     44
    };

    it('should edit the new resource', function(done) {
      request(app)
        .put('/api/usuarios/13')
        .set('Content-Type', 'application/json')
        .send(existingResource)
        .end(function(err, res) {
          if (err) return done(err);          // should.not.exist(err);

          res.type.should.match(/json/);
          res.status.should.equal(httpStatus.OK);
          res.body.should.eql({
            id:       13,
            nombre:   "modified name",
            apellido: "new surname",
            edad:     44
          });
          done();
        })
      ;
    });

    it('should get the modified resource', function(done) {
      request(app)
        .get('/api/usuarios/13')
        .end(function(err, res) {
          if (err) return done(err);          // should.not.exist(err);

          res.type.should.match(/json/);
          res.status.should.equal(httpStatus.OK);
          res.body.should.eql({
            id:       13,
            nombre:   "modified name",
            apellido: "new surname",
            edad:     44
          });
          done();
        })
      ;
    });

    it('should delete the new resource', function(done) {
      request(app)
        .del('/api/usuarios/13')
        .expect('Content-Type', /application\/json/)
        .expect(200, done)
      ;
    });

    it('should have 12 resources', function(done) {
      expectCount('usuarios', 12, done);
    });

    it('should NOT get the new resource', function(done) {
      request(app)
        .get('/api/usuarios/13')
        .end(function(err, res) {
          if (err) return done(err);          // should.not.exist(err);

          res.type.should.match(/json/);
          res.status.should.equal(httpStatus.NOT_FOUND);
          done();
        })
      ;
    });

  });
});

var expectCount = function(resource, count, done) {
  request(app)
    .get('/api/usuarios/count')
    .expect('Content-Type', /application\/json/)
    .expect(count.toString())
    .expect(httpStatus.OK, done)
  ;
};