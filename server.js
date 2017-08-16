const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose')
const morgan = requre('morgan')

const {DATABASE_URL, PORT} = require("./assets/config")
const {Budget} = require("./assets/models")

const app = express();

app.use(morgan('common'));
app.use(bodyParser.json());

mongoose.Promise=global.Promise;

app.get('/budgets/:id', (req, res) => {
  Budget
    .findById(req.params.id)
    .exec()
    .then(budget => res.json(budget.apiRepr()))
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
      console.error(message)
    }
  }
  Budget
    .create({
      username: req.body.username,
      weeklyIncome: req.body.weeklyIncome,
      availableIncome: req.body.availableIncome,
      type: req.body.type,
      categories: req.body.categories
    })
    .then(
      post => res.status(201).json(budget.apiRepr())
    .catch(err => {
      console.error(err)
      res.status(500).json({message: 'Internal server error'})
    }))
})

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