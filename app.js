$(document).ready(loadState)
$('#pay-day').on('click', payDay)
$('.pay-it').on('click', payBill)
$('form').on('submit', saveState);
$('#submit').on('click', formSubmit)


// extract value from user object
// have a form compile data from our table to submit

// let STATE = {}
// let loadedState = {}

function payBill(event){
  event.preventDefault()
  console.log(event)
}

function payDay(event){
  event.preventDefault()
  let income = Number($('#income').html())
  let remainingFunds = Number($('#remainingFunds').html())
  $('#remainingFunds').html(income+=remainingFunds)
}

function saveState(event) {
  event.preventDefault()
  const savedState = Object.assign({}, newState, loadedState)
  alert("Information Saved!")
}

function loadState(event){
  // var url = "/budgets/:id"
  $.getJSON("./seed-data.json", function(response){
    storeLocally(response)
	})
}

function storeLocally(state) {
  let loadedState = state
  render(loadedState)
}

function render(state){
  $('.income').html(`${state.weeklyIncome}`)
  $('#remainingFunds').html(`${state.availableIncome}`)
    for(var i=0; i<state.categories.length; i++){
      show(state.categories[i])
    }
}

function show(category){
$(`#${category.table}`).append(
        `<tr>
        <th id="${category.name}">${category.name}</th>
        <td contenteditable="true" class="changeable amount" data-category="${category.name}" data-column="amount">${category.amount}</td>
        <td><button type="button" class="pay-it">Pay It</button></td>
        </tr>`)
}

const newState = {}

function saveState(event){
  event.preventDefault()

  var fields = $("td[contenteditable]")
  $.each(fields, function(i, field) {
    let fieldCategory = field.dataset.category.toCamelCase();
    newState[fieldCategory] = field.textContent;
  })
  console.log(newState)
}

function formSubmit(event){
  
}
// save categories as new state
// compare new state to old state
// compile into one state
// send new state to server
// WHEN PAGE LOADS:
// get budget data from server
// populate STATE with data
// use STATE as source for rendering
// rinse, repeat

// - User loads page 
// - Page uses jQuery to request budget data from your DB 
// - jQuery takes the data it gets back and puts it in the state. 
// We now have a state object that looks like the DB; a sort of local copy of the DB 
// - User uses the app to make changes to their budget 
// - jQuery saves these changes in the local state 
// - When user is done (for now signified by them pressing a button manually) 
// local state is used to update DB


