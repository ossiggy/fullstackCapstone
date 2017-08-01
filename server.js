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
    .findById(req.params.id);
    .exec();
    .then(budget => res.json(budget.apiRepr()));
    .catch(err => {
      console.error(err);
      res.status(500).json({error: 'something went wrong'})
    });
});






// const STATE = {
  

// }
// const form = $('form');
// const textField = $('#text-field');

// form.on("submit", saveName);

// function saveName(e) {
//     const userName = textField.val();
//     STATE.name = userName;
//     sendToServer(STATE);
// }

// // WHEN USER SAVES:
// // send state (or updated relevant parts) to server
// // WHEN PAGE LOADS:
// // get budget data from server
// // populate STATE with data
// // use STATE as source for rendering
// // rinse, repeat