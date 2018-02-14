const express = require('express')
const passport = require('passport')
const bodyParser = require('body-parser')

const router = express.Router();

const jsonParser = bodyParser.json();

const {User} = require('./models');
const {Budget, Category} = require('./')

router.get('/:id', (req, res) => {

  const {userId, authToken} = req.cookies;

  User
    .findById(userId)
    .populate({
      path: 'budget',
      model: 'Budget',
      populate: {
        path: 'categories',
        model: 'Category'
      }
    })
    .exec(function(err, doc){
      res.send(doc)
    })
    .then(user => res.status(204).send('here'))
})

router.post('/newuser', jsonParser, (req, res) => {
  const requiredFields = ['username', 'password', 'email'];
  const missingField = requiredFields.find(field => !(field in req.body));

  if(missingField) {
    return res.status(422).json({
      code: 422,
      reason: 'ValidationError',
      message: 'Missing field',
      location: missingField
    });
  };

  const stringFields = ['username', 'password', 'email'];
  const nonStringField = stringFields.find(
    field => field in req.body && typeof req.body[field] !== 'string'
  );

  if(nonStringField) {
    return res.status(422).json({
      code: 422,
      reason: 'ValidationError',
      message: 'Incorrect field type: expected string',
      location: nonStringField
    });
  }

  const explicityTrimmedFields = ['username', 'password', 'email'];
  const nonTrimmedField = explicityTrimmedFields.find(
    field => req.body[field].trim() !== req.body[field]
  );

  if(nonTrimmedField) {
    return res.status(422).json({
      code: 422,
      reason: 'ValidationError',
      message: 'Cannot start or end with space',
      location: nonTrimmedField
    });
  }

  const sizedFields = {
    username: {
      min: 4,
      max: 15
    },
    password: {
      min: 4,
      max: 72
    }
  };
  const tooSmallField = Object.keys(sizedFields).find(
    field =>
      'min' in sizedFields[field] &&
      req.body[field].trim().length < sizedFields[field].min
  );
  const tooLargeField = Object.keys(sizedFields).find(
    field =>
      'max' in sizedFields[field] &&
      req.body[field].trim().length > sizedFields[field].max
  );

  if (tooSmallField || tooLargeField){
    return res.status(422).json({
      code: 422,
      reason: 'ValidationError',
      message: tooSmallField
        ? `Must be at least ${sizedFields[tooSmallField]
            .min} characters long`
        : `Cannot exceed ${sizedFields[tooLargeField]
            .max} characters`,
      location: tooSmallField || tooLargeField
    });
  }

  let {username, password, email} = req.body

  return User.find({username})
    .count()
    .then(count => {
      if(count > 0) {
        return Promise.reject({
          code: 422,
          reason: 'ValidationError',
          message: 'Username unavailable',
          location: 'username'
        });
      }
      return User.hashPassword(password)
    })
    .then(hash => {
      return User.create({
        username,
        password: hash,
        email
      });
    })
    .then(user => {
      return res.status(201).json(user.apiRepr())
    })
    .catch(err => {
      console.log(err)
      if(err.reason === 'ValidationError'){
        return res.status(err.code).json(err)
      }
      res.status(500).json({code: 500, message: 'Internal server error'})
    });
});

module.exports = {router};