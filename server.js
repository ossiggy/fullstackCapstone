const bodyParser = require('body-parser');
const express = require('express');
const path = require('path');
const mongoose = require('mongoose')
const morgan = require('morgan')
const cors = require('cors')
const passport = require('passport')
const budgetRouter = require('./budgets/budgetRouter')
require('dotenv').config();

const {router: usersRouter} = require('./users')
const {router: authRouter, basicStrategy, jwtStrategy} = require('./auth')

const {DATABASE_URL, PORT} = require("./config")

const app = express();

app.use(morgan('common'));
app.use(bodyParser.json());

app.use(express.static('public'));

app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE');
  if (req.method === 'OPTIONS') {
      return res.send(204);
  }
  next();
});

app.use(budgetRouter)

mongoose.Promise=global.Promise;

app.use(passport.initialize());
passport.use(basicStrategy);
passport.use(jwtStrategy);

app.use('/api/users/', usersRouter);
app.use('/api/auth', authRouter);


app.get('/', (req, res) => {
  res.sendFile('index.html')
});

app.get(
  '/api/protected',
  passport.authenticate('jwt', {session: false}),
  (req, res) => {
    return res.json({
      data: 'data here'
    });
  }
);

app.get('/signup', (req, res) => {
  res.sendFile('signup.html', {root: __dirname + '/public'})
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