const express = require('express');
const mongoose = require('mongoose')
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const router = express.Router();
const {Budget, Category} = require('./models')

mongoose.Promise=global.Promise;

router.get('/budgets', (req, res) => {
  Budget
    .find()
    .populate('categories')
    .exec(function(err, categories){
      if(err) return 'error';
    })
    .then(budgets => {
      res.json(budgets.map(budget => budget.apiRepr()))
    })
    .catch(err => {
      console.error(err)
      res.status(500).json({error: "something went wrong"})
    })
})

router.get('/budgets/:id', (req, res) => {
  Budget
    .findById(req.params.id)
    .populate('categories')
    .exec(function(err, categories){
      if(err) return "error";
    })
    .then(
      budget => res.json(budget.apiRepr()))
    .catch(err => {
      console.error(err);
      res.status(500).json({error: 'something went wrong'})
    })
})

router.post('/budgets', (req, res) => {
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
      budget => {
        for(let i=0; i<categories.length; i++){
        Category.create({
          _parent: budget._id,
          table: categories[i].table,
          name: categories[i].name,
          amount: categories[i].amount
        })
        .then(
          category => budget.update({$push: {"categories": {_id:category._id}}}, {safe: true, upsert: true})
        )}
    })
    .then(budget => res.status(204).end())
    .catch(err => {
        console.error(err)
        res.status(500).json({message: 'Internal server error'})
      })   
})

router.put('budgets/:id', (req, res) => {
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

router.delete('/budgets/:id', (req, res) => {
  Budget
    .findByIdAndRemove(req.params.id)
    .exec()
    .then(post => res.status(204).end())
    .catch(err => res.status(500).json({message: 'Inernal server error'}))
})

module.exports = {router};