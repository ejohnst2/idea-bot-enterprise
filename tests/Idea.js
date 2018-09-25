process.env.NODE_ENV = 'test'

const mongoose = require('mongoose')
const chai = require('chai')
const chaiHtpp = require('chai-http')
const server = require('../index')
const should = chai.should()
const Idea = require('../models/Idea')

chai.use(chaiHtpp)

describe('Idea', () => {
  beforeEach(done => {
    Idea.deleteOne({}, err => {
      done()
    })
  })

  describe('/POST Idea', () => {
    it('it should post an Idea', done => {
      let newIdea = {
        text: 'test idea',
        user: 't5345435-k90',
        channel: 'test-idea-slack',
        teamId: 'g34543jjkl90',
      }

      chai
        .request(server)
        .post('/Idea/')
        .send(newIdea)
        .end((err, res) => {
          res.should.have.status(200)
          // res.body.should.be.a('object')
          // res.body.should.have.property('message').eql('Idea successfully saved!')
          // res.body.Idea.should.have.property('text').eql('test idea')
          // res.body.Idea.should.have.property('user').eql('t5345435-k90')
          done()
        })
    })
  })
})
