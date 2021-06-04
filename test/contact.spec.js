import { describe, it } from 'mocha';
import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
const mongoose = require('mongoose');
// import connection from '../src/utils/db';
import app from '../src/server';

chai.use(chaiHttp);
let token = null;
let contactId = null;
describe('Authentication Routes', () => {
  before(function (done) {
    chai
      .request(app)
      .post('/auth/login')
      .send({
        username: 'popo',
        password: 'secret'
      })
      .end((err, res) => {
        token = res.body.token;
        if (err) return done(err);
        done();
      });
  });
  describe('Handles create contact endpoint', () => {
    it('should fail if validation fails', (done) => {
      chai
        .request(app)
        .post('/contact/create')
        .send({
          name: 'popo'
        })
        .set('Authorization', `Bearer ${token}`)
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
        .post('/contact/create')
        .send({
          name: 'My COntact',
          phoneNumber: '08033333333',
          email: 'aigbefoephraim@yahoo.com',
          address: 'my address'
        })
        .set('Authorization', `Bearer ${token}`)
        .end((err, res) => {
          contactId = res.body.contact._id;
          expect(res.status).to.equal(201);
          expect(res.body.message).to.equal('successful');
          if (err) return done(err);
          done();
        });
    });

    it('should fail if phone number exists for the contact already', (done) => {
      chai
        .request(app)
        .post('/contact/create')
        .send({
          name: 'My COntact',
          phoneNumber: '08033333333',
          email: 'aigbefoephraim@yahoo.com',
          address: 'my address'
        })
        .set('Authorization', `Bearer ${token}`)
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body.message).to.equal('this phone number already exist for this contact');
          if (err) return done(err);
          done();
        });
    });
  });

  describe('Handles get all user contacts endpoint', () => {
    it('should fail for missing authorization header', (done) => {
      chai
        .request(app)
        .get('/contact/all')
        .end((err, res) => {
          expect(res.status).to.equal(401);
          expect(res.body.message).to.equal('Authorization token is invalid');
          if (err) return done(err);
          done();
        });
    });

    it('should fail for missing authorization token', (done) => {
      chai
        .request(app)
        .get('/contact/all')
        .set('Authorization', `Bearer`)
        .end((err, res) => {
          expect(res.status).to.equal(401);
          expect(res.body.message).to.equal('Authorization token is missing');
          if (err) return done(err);
          done();
        });
    });

    it('should fail for unknown token', (done) => {
      chai
        .request(app)
        .get('/contact/all')
        .set(
          'Authorization',
          `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYwYjg1NzNlOTRiNDUxNWRhOGYyZWIzOCIsInVzZXJuYW1lIjoiZ29sZDEyIiwidGltZSI6IjIwMjEtMDYtMDRUMTY6MDg6MzguNDI4WiIsImlhdCI6MTYyMjgyMjkxOCwiZXhwIjoxNjIyOTA5MzE4fQ.ExyaxWy-seF0XnWjda-b65EkfRVI0F7AkNeuYGo0ub8`
        )
        .end((err, res) => {
          expect(res.status).to.equal(401);
          expect(res.body.message).to.equal('Failed to authenticate user');
          if (err) return done(err);
          done();
        });
    });

    it('should get all contacts belonging to user', (done) => {
      chai
        .request(app)
        .get('/contact/all')
        .set('Authorization', `Bearer ${token}`)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body.message).to.equal('contacts retrieved successfully');
          if (err) return done(err);
          done();
        });
    });
  });

  describe('Handles get single user contact endpoint', () => {
    it('should pass for contact fetch', (done) => {
      chai
        .request(app)
        .get(`/contact/single/${contactId}`)
        .set('Authorization', `Bearer ${token}`)
        .end((err, res) => {
          console.log(contactId);
          expect(res.status).to.equal(200);
          expect(res.body.message).to.equal('contact retrieved successfully');
          if (err) return done(err);
          done();
        });
    });

    it('should fail to get contact that does not exist', (done) => {
      chai
        .request(app)
        .get('/contact/single/60b8c71137fdf36f94d121ef')
        .set('Authorization', `Bearer ${token}`)
        .end((err, res) => {
          expect(res.status).to.equal(404);
          expect(res.body.message).to.equal('contact does not exist');
          if (err) return done(err);
          done();
        });
    });
  });

  describe('Handles update contact endpoint', () => {
    it('should fail if validation fails', (done) => {
      chai
        .request(app)
        .put('/contact/update/60b8c71137fdf36f94d121ef')
        .send({
          name: 'popo'
        })
        .set('Authorization', `Bearer ${token}`)
        .end((err, res) => {
          expect(res.status).to.equal(422);
          expect(res.body.message).to.equal('validation failed');
          if (err) return done(err);
          done();
        });
    });

    it('should update a contact', (done) => {
      chai
        .request(app)
        .put(`/contact/update/${contactId}`)
        .send({
          name: 'My Contact',
          phoneNumber: '08033333330',
          email: 'aigbefoephraim@yahoo.com',
          address: 'my address'
        })
        .set('Authorization', `Bearer ${token}`)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body.message).to.equal('successful');
          if (err) return done(err);
          done();
        });
    });

    it('should fail if contact does not exist for user', (done) => {
      chai
        .request(app)
        .put('/contact/update/60b8c71137fdf36f94d121ef')
        .send({
          name: 'My COntact',
          phoneNumber: '08033333333',
          email: 'aigbefoephraim@yahoo.com',
          address: 'my address'
        })
        .set('Authorization', `Bearer ${token}`)
        .end((err, res) => {
          expect(res.status).to.equal(404);
          expect(res.body.message).to.equal('contact does not exist');
          if (err) return done(err);
          done();
        });
    });
  });

  describe('Handles remove contact endpoint', () => {
    it('should delete contact', (done) => {
      chai
        .request(app)
        .delete(`/contact/remove/${contactId}`)
        .set('Authorization', `Bearer ${token}`)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body.message).to.equal('contact removed successfully');
          if (err) return done(err);
          done();
        });
    });

    it('should fail to get contact that does not exist', (done) => {
      chai
        .request(app)
        .delete('/contact/remove/60b8c71137fdf36f94d121ef')
        .set('Authorization', `Bearer ${token}`)
        .end((err, res) => {
          expect(res.status).to.equal(404);
          expect(res.body.message).to.equal('contact does not exist');
          if (err) return done(err);
          done();
        });
    });
  });
});
