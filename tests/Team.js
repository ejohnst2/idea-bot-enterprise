process.env.NODE_ENV = 'test'

const mongoose = require('mongoose')
const chai = require('chai')
const chaiHtpp = require('chai-http')
const server = require('../index')
const should = chai.should()
const Team = require('../models/Team')

chai.use(chaiHtpp)

describe('Team', () => {
  beforeEach(done => {
    Team.deleteOne({}, err => {
      done()
    })
  })

  describe('/POST Team', () => {
    it('it should NOT post Team without botAuthorization', done => {
      const team = {
        botAuthorization: 'x-tobeosdfsd321432432432',
      }
      chai
        .request(server)
        .post('/Team/')
        .send(team)
        .end((err, res) => {
          res.should.have.status(200)
          res.body.should.be.a('object')
          res.body.should.have
            .property('message')
            .eql('Team successfully saved!')
          res.body.Team.should.have
            .property('botAuthorization')
            .eql('x-tobeosdfsd321432432432')
          done()
        })
    })
  })
})
