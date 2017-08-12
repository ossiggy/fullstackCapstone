const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const {Budget} = require('./budgets')

router.get('/', (req, res) => {
  res.json(Budget.get())
})

router.post('/', (req, res)=>{
  const requiredFields = ['username', 'availableIncome', 'type', 'categories']
  for(let i=0; i<requiredFields.length; i++){
    const field = requiredFields[i]
    if(!(field in req.body)){
      const message = `Missing \`${field}\` in request body`
      console.error(message)
      return res.status(400).send(message)
    }
  }
  const item = Budget.create(req.body.username, req.body.availableIncome, req.body.type, req.body.categories)
  res.status(201).json(item)
})

router.delete('/:id', (req, res)=>{
  Budget.delete(req.params.id)
  console.log(`Deleted shopping list item \`${req.params.id}\``)
  res.status(204).end()
})

router.put('/:id',jsonParser, (req,res) => {
  const requiredFields = ['username', 'availableIncome', 'type', 'categories']
  for(let i=0; i<requiredFields.length; i++){
    const field = requiredFields[i]
    if(!(field in req.body)){
      const message = `Missing \`${field}\` in request body`
      console.error(message)
      return res.status(400).send(message)
    }
  }
  if(req.params.id !== req.body.id) {
    const message = (
      `Request path id (${req.params.id} and request body id`
      `(${req.body.id}) must match)`)
      console.error(message)
      return res.status(400).send(message)
  }
  console.log(`Updating shopping list item \`${req.params.id})`)
  const updatedItem = Budget.update({
    id: req.params.id,
    name:req.params.categories.name,
    amount: req.params.categories.amount,
    goal:req.params.categories.goal,
    balance:req.params.categories.balance  
  })
  res.json(updatedItem)
})

module.epports = router;