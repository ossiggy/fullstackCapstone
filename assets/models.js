const mongoose = require('mongoose')

const budgetSchema = mongoose.Schema({
    username: {type: String, required: true},
    income: {type: Number, required: true},
    budget: {
      name: {type: String, required: true},
      amount: {type: Number},
      goal: {type: Number},
      balance: {type: Number}
    }
})

budgetSchema.methods.apiRepr = function(){
  return{
    id: this._id,
    username: this.username,
    income: this.income,
    budget: this.budget
  }
}

const Budget = mongoose.model('Budget', budgetSchema)

module.exports = {Budget}