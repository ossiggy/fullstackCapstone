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
