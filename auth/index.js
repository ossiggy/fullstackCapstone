const {router} = require('./router')
const {basicStrategy, jwtStrategy} = require('./strategies');

module.exports = {basicStrategy, jwtStrategy};