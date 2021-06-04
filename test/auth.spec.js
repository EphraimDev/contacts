import { describe, it } from 'mocha';
import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
const mongoose = require('mongoose');
// import connection from '../src/utils/db';
import app from '../src/server';

chai.use(chaiHttp);
describe('Authentication Routes', () => {
  before(function (done) {
    const uri = `mongodb+srv://${process.env.TEST_DB_USER}:${process.env.TEST_DB_PASS}@${process.env.TEST_DB_SERVER}/${process.env.TEST_DB_NAME}`;
    mongoose.connect(
      uri,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true
      },
      function () {
        mongoose.connection.db.dropDatabase(function () {
          console.log('database dropped');
          done();
        });
      }
    );
  });
  describe('Handles sign up endpoint', () => {
    it('should fail if validation fails', (done) => {
      chai
        .request(app)
        .post('/auth/signup')
        .send({
          username: 'popo',
          email: 'aigbefoephraim@yahoo.com',
          password: 'password'
        })
        .end((err, res) => {
          expect(res.status).to.equal(422);
          expect(res.body.message).to.equal('validation failed');
          if (err) return done(err);
          done();
        });
    });

    it('should create a new user', (done) => {
      chai
        .request(app)
        .post('/auth/signup')
        .send({
          name: 'Tester Tester',
          username: 'popo',
          email: 'aigbefoephraim@yahoo.com',
          password: 'password'
        })
        .end((err, res) => {
          expect(res.status).to.equal(201);
          expect(res.body.message).to.equal('Sign up successful');
          if (err) return done(err);
          done();
        });
    });

    it('should fail if user exists', (done) => {
      chai
        .request(app)
        .post('/auth/signup')
        .send({
          name: 'Tester Tester',
          username: 'popo',
          email: 'aigbefoephraim@yahoo.com',
          password: 'password'
        })
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body.message).to.equal('user exists already');
          if (err) return done(err);
          done();
        });
    });
  });

  describe('Handles Login endpoint', () => {
    it('should fail if validation fails', (done) => {
      chai
        .request(app)
        .post('/auth/login')
        .send({
          username: 'popo'
        })
        .end((err, res) => {
          expect(res.status).to.equal(422);
          expect(res.body.message).to.equal('validation failed');
          if (err) return done(err);
          done();
        });
    });

    it('should fail if user does not exist', (done) => {
      chai
        .request(app)
        .post('/auth/login')
        .send({
          username: 'popo1',
          password: 'password'
        })
        .end((err, res) => {
          expect(res.status).to.equal(404);
          expect(res.body.message).to.equal('user does not exist');
          if (err) return done(err);
          done();
        });
    });

    it('should fail if password is wrong', (done) => {
      chai
        .request(app)
        .post('/auth/login')
        .send({
          username: 'popo',
          password: 'password1'
        })
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body.message).to.equal('incorrect login details');
          if (err) return done(err);
          done();
        });
    });

    it('should login successfully', (done) => {
      chai
        .request(app)
        .post('/auth/login')
        .send({
          username: 'popo',
          password: 'password'
        })
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body.message).to.equal('login successful');
          if (err) return done(err);
          done();
        });
    });
  });

  describe('Handles forgot password endpoint', () => {
    it('should fail if validation fails', (done) => {
      chai
        .request(app)
        .post('/auth/forgotPassword')
        .end((err, res) => {
          expect(res.status).to.equal(422);
          expect(res.body.message).to.equal('validation failed');
          if (err) return done(err);
          done();
        });
    });

    it('should fail if user does not exist', (done) => {
      chai
        .request(app)
        .post('/auth/forgotPassword')
        .send({
          username: 'popo1'
        })
        .end((err, res) => {
          expect(res.status).to.equal(404);
          expect(res.body.message).to.equal('user does not exist');
          if (err) return done(err);
          done();
        });
    });

    it('should fail if token does not exist', (done) => {
      chai
        .request(app)
        .post('/auth/changePassword')
        .send({
          username: 'popo',
          token: '111111',
          newPassword: 'secret'
        })
        .end((err, res) => {
          expect(res.status).to.equal(404);
          expect(res.body.message).to.equal('user does not have an otp');
          if (err) return done(err);
          done();
        });
    });

    it('should send token to email', (done) => {
      chai
        .request(app)
        .post('/auth/forgotPassword')
        .send({
          username: 'popo'
        })
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body.message).to.equal('email sent');
          if (err) return done(err);
          done();
        });
    });
  });

  describe('Handles change password endpoint', () => {
    it('should fail if validation fails', (done) => {
      chai
        .request(app)
        .post('/auth/changePassword')
        .send({
          username: 'popo'
        })
        .end((err, res) => {
          expect(res.status).to.equal(422);
          expect(res.body.message).to.equal('validation failed');
          if (err) return done(err);
          done();
        });
    });

    it('should fail if user does not exist', (done) => {
      chai
        .request(app)
        .post('/auth/changePassword')
        .send({
          username: 'popo1',
          token: '111111',
          newPassword: 'secret'
        })
        .end((err, res) => {
          expect(res.status).to.equal(404);
          expect(res.body.message).to.equal('user does not exist');
          if (err) return done(err);
          done();
        });
    });

    it('should fail if token does not match', (done) => {
      chai
        .request(app)
        .post('/auth/changePassword')
        .send({
          username: 'popo',
          token: '111112',
          newPassword: 'secret'
        })
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body.message).to.equal('OTP does not match');
          if (err) return done(err);
          done();
        });
    });

    it('should succeed', (done) => {
      chai
        .request(app)
        .post('/auth/changePassword')
        .send({
          username: 'popo',
          token: '111111',
          newPassword: 'secret'
        })
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body.message).to.equal('password changed successfully');
          if (err) return done(err);
          done();
        });
    });
  });
});
