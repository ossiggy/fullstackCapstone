const chai = require('chai')
const chaiHttp = require('chai-http')
const {ObjectID} = require('mongodb')
const faker = require('faker')
const mongoose = require('mongoose')

const {app, runServer, closeServer} = require('../server')
const {DATABASE_URL} = require('../assets/config')
const {TEST_DATABASE_URL} = require('../assets/config')
const {Budget, Category} = require('../models')

const testID = new ObjectID();

mongoose.Promise = global.Promise

const should = chai.should()

chai.use(chaiHttp)

function tearDownDb() {
  return new Promise((resolve, reject) => {
    console.warn('Deleting database');
    mongoose.connection.dropDatabase()
      .then(result => resolve(result))
      .catch(err => reject(err))
  });
}

let testId;

function seedBudgetData() {
  console.info('seeding budget data')
    const seedData = {
      username: faker.internet.userName(),
      availableIncome: faker.random.number(),
      weeklyIncome: faker.random.number(),
      categories:[]
      // according to our models, categories is looking for an array of reference id's, not objects
      // we must create the category object seperately with a reference id to the parent and push the reference id
      // to the categories array.  we need the category to acutally exist tho or else it will throw an error
    }
    const budget = seedData
    return Budget.create(budget)
    .then(
      budget =>{
        return Category.create({ 
          _parent: budget._id,
          amount: faker.random.number(),
          name: faker.lorem.word(),
          table: faker.lorem.word()
        })
        .then(
          category => budget.update({$push: {'categories': {_id: category._id}}}, {safe: true, upsert: true, new: true})
        )
      }
    )
    .catch( err => console.log(err))
}

describe('Budge My Life', function(){
  before(function(){
    return runServer()
  })

  beforeEach(function(){
    console.log(seedBudgetData())
    return seedBudgetData()
  })

  afterEach(function(){
    return tearDownDb()
  })

  after(function(){
    return closeServer()
  })

  it.only('Should list specific budget on GET', function(){
    //write get endpoint in server
    //return all budgets
    //search for one budget of that response
    let res
    return chai.request(app)
      .get('/budgets')
      .then(function(res){
        res.should.have.status(200)
        res.should.be.json
        res.body.forEach(function(budget){
          const expectedKeys = ['username', 'availableIncome', 'weeklyIncome', 'categories', 'id']
          budget.should.include.keys(expectedKeys)
          budget.categories.should.be.a('array')
          budget.categories.length.should.be.at.least(1)
          const categoryKeys = ['amount', 'name', 'table', '_parent']
          budget.categories.forEach(function(category){
            category.should.be.a('object')
            category.should.include.keys(categoryKeys)
          })
        })
        resBudget = res.body[0].id
        return Budget.findById(resBudget)
        })
        .then(function(budget){
          console.log(budget)
        })
      })

  it('Should add budgets on POST', function(){
    const newBudget = {username: 'ozzyMan', availableIncome: 1250, weeklyIncome: 1500, categories: [{table: "vertical-1", name: "dogs", amount: 130}]}
    return chai.request(app)
      .post('/budgets')
      .send(newBudget)
      .then(function(res){
        res.should.have.status(204)
      })
  })
})