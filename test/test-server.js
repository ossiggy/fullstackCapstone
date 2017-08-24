const chai = require('chai')
const chaiHttp = require('chai-http')

const {app, runServer, closeServer} = require('../server')

const should = chai.should()

chai.use(chaiHttp)

describe('Budge My Life', function(){
  before(function(){
    return runServer()
  })
  after(function(){
    return closeServer()
  })

  it('Should list specific budget on GET', function(){
    return chai.request(app)
      .get('/budgets/599c6fe36d933de2b8d39cb0')
      .then(function(res){
        res.should.have.status(200)
        res.should.be.json
        res.body.categories.should.be.a('array')
        res.body.categories.length.should.be.at.least(1)
        const expectedKeys = ['username', 'availableIncome', 'weeklyIncome', 'categories']
        res.body.should.include.keys(expectedKeys)
        const categoryKeys = ['amount', 'name', 'table', '_parent']
        res.body.categories.forEach(function(category){
          category.should.be.a('object')
          category.should.include.keys(categoryKeys)
        })
      })
  })

  it('Should add budgets on POST', function(){
    const newBudget = {username: 'ozzyMan', availableIncome: 1250, weeklyIncome: 1500, categories: [{table: "vertical-1", name: "dogs", amount: 130}]}
    return chai.request(app)
      .post('/budgets')
      .send(newBudget)
      .then(function(res){
        res.should.have.status(201)
        res.should.be.json
        res.body.should.be.a('object')
        res.body.should.include.keys('id', 'username', 'weeklyIncome', 'availableIncome', 'categories')
        res.body.categories.should.be.a('array')
        res.body.categories.length.should.be.at.least(1)
        res.body.id.should.not.be.null
        res.body.should.deep.equal(Object.assign(newBudget, {id: res.body.id}))
      })
  })
})