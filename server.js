const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose')
const morgan = require('morgan')
const cors = require('cors')

const {DATABASE_URL, PORT} = require("./assets/config")
const {Budget, Category} = require("./models")

const app = express();

app.use(morgan('common'));
app.use(bodyParser.json());
app.use(cors())

mongoose.Promise=global.Promise;

app.get('/budgets/:id', (req, res) => {
  Budget
    .findById(req.params.id)
    .populate('categories')
    .exec(function(err, categories){
      if(err) return "error";
        console.log(categories)
    })
    .then(
     //populate by or either category or budget 
      budget => res.json(budget.apiRepr()))
    .catch(err => {
      console.error(err);
      res.status(500).json({error: 'something went wrong'})
    })
})

app.post('/budgets', (req, res) => {
  const requiredFields = ['username', 'availableIncome', 'weeklyIncome', 'categories']
  for(let i=0; i<requiredFields.length; i++){
    const field = requiredFields[i]
    if(!(field in req.body)){
      const message = `Missing \`${field}\` in request body`
      console.log(field)
      console.error(message)
    }
  }
  const {username, weeklyIncome, availableIncome, categories} = req.body
  
Budget
  .create({
    username,
    weeklyIncome,
    availableIncome,
    categories: []
  })
    .then(
      budget => {for(let i=0; i<categories.length; i++){
        Category.create({
          _parent: budget._id,
          table: categories[i].table,
          name: categories[i].name,
          amount: categories[i].amount
        })
        .then(
          category => budget.update({$push: {"categories": {_id:category._id}}}, {safe: true, upsert: true})
        )
      }
    budget => res.sendStatus(201)}
    ).catch(err => {
      console.error(err)
      res.status(500).json({message: 'Internal server error'})
    })
    
})
  // Budget
  // //I don’t see you taking the `req.body.categories` data and creating a `Category` out of it. 
  // //Just because you have told `Budget` that `categories` has an objectId association doesn’t mean it 
  // //automatically fills in the blanks and creates that for you.
  // //The first thing I have to do in this example is _find_ the campground, from there I can create a comment 
  // //and that comment will be associated with the specific campground.
  //   .create({
  //     username,
  //     weeklyIncome,
  //     availableIncome,
  //     categories
  //   })

app.put('budgets/:id', (req, res) => {
  if(!(req.params.id && req.body.id && req.params.id)){
    const message = (
      `Request patch id (${req.params.id} and request body id (${req.body.id}) must match)`)
      console.error(message)
      res.status(400).json({message: message})
  }

  const toUpdate = {}
  const updateableFields = ['availableIncome', 'weeklyIncome', 'categories.name', 'categories.amount']

  updateableFields.forEach(field => {
    if (field in req.body) {
      toUpdate[field] = req.body[field]
    }
  })

  Budget
    .findByIdAndUpdate(req.params.id, {$set: toUpdate})
    .exec()
    .then(post => res.status(204).end())
    .catch(err => res.status(500).json({message: 'Internal server error'}))
})

app.delete('/budgets/:id', (req, res) => {
  Budget
    .findByIdAndRemove(req.params.id)
    .exec()
    .then(post => res.status(204).end())
    .catch(err => res.status(500).json({message: 'Inernal server error'}))
})

app.use('*', function(req, res){
  res.status(404).json({message: 'Not found'})
})

let server

function runServer(databaseUrl=DATABASE_URL, port=PORT) {

  return new Promise((resolve, reject) => {
    mongoose.connect(databaseUrl, err =>{
      if (err) {
        return reject(err)
      }
      server = app.listen(port, () => {
        console.log(`Your app is listening on port ${port}`)
        resolve()
      })
      .on('error', err => {
        mongoose.disconnect()
        reject(err)
      })
    })
  })
}

function closeServer() {
  return mongoose.disconnect().then(() => {
    return new Promise((resolve, reject) => {
      console.log('Closing server')
      server.close(err => {
        if(err) {
          return reject(err)
        }
        resolve()
      })
    })
  })
}

if(require.main === module){
  runServer().catch(err => console.error(err))
}

module.exports = {app, runServer, closeServer}