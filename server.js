const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose')
const morgan = require('morgan')
const cors = require('cors')
const budgetRouter = require('./budgets/budget-router')

const {DATABASE_URL, PORT} = require("./config")

const app = express();

app.use(morgan('common'));
app.use(bodyParser.json());

app.use(express.static(__dirname + '/public'));

app.use(cors())
app.use(budgetRouter)

mongoose.Promise=global.Promise;

app.get('/', (req, res) => {
  res.sendFile('index.html')
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