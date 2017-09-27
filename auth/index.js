const {router} = require('./authRouter')
const {basicStrategy, jwtStrategy} = require('./strategies');

module.exports = {basicStrategy, jwtStrategy};