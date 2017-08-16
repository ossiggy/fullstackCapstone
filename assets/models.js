const mongoose = require('mongoose')


//parent budget
const budgetSchema = mongoose.Schema({
   username: {type: String, required: true},
   availableIncome: {type: Number, required: true},
   weeklyIncome: {type: Number, required: true},
   categories: [{type: mongoose.Schema.Types.ObjectId, ref:'Category'}]
});

const categorySchema = mongoose.Schema({
  _parent:{type: mongoose.Schema.Types.ObjectId, ref:'Budget'},
  table: {type:String, required: true},
  name: {type: String, required: true},
  amount: {type: Number, required: true},
})

// one Budget has many BudgetCategories
// one BudgetCategory has many Properties

budgetSchema.methods.apiRepr = function(){
  return{
    id: this._id,
    availableIncome: this.availableIncome,
    weeklyIncome: this.weeklyIncome,
    categories: this.categories
  }
}

const Budget = mongoose.model('Budget', budgetSchema)

module.exports = {Budget}