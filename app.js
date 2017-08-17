$(document).ready(loadState)
$('#pay-day').on('click', payDay)
$('form').on('click','.pay-it', payBill)
$('form').on('submit', createState);
// $('#submit').on('click', formSubmit)

let newState = {}
const loadedState = {}

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
  $('#sign-in').append(
    `<h3 class='welcome'>welcome ${state.username}</h3>
      <div id='username' class='hidden'>${state.username}</div>`
  )
  $('#income').html(`${state.weeklyIncome}`)
  $('#remainingFunds').html(`${state.availableIncome}`)
    for(var i=0; i<state.categories.length; i++){
      show(state.categories[i])
    }
}

function show(category){
$(`#${category.table}`).append(
        `<tr class="tableData">
          <th contenteditable="true" class="changeable name" data-table="${category.table}" id="${category.name}">${category.name}</th>
          <td contenteditable="true" class="changeable amount" data-category="${category.name}" data-column="amount">${category.amount}</td>
          <td><button type="button" class="pay-it">Paid</button></td>
        </tr>`)
}

function payBill(event){
  event.preventDefault()
  let remainingFunds = Number($('#remainingFunds').html())
  let amount = Number($(this).parent().siblings('td[data-column="amount"]').html())
  remainingFunds -= amount
  $('#remainingFunds').html(remainingFunds)
  this.disabled = true;
}

function payDay(event){
  event.preventDefault()
  let income = Number($('#income').html())
  let remainingFunds = Number($('#remainingFunds').html())
  $('#remainingFunds').html(income+=remainingFunds)
  this.disabled = true;
}

function createState(event){
  event.preventDefault()
  const username = $('#username').html()
  const income = $('#income').html()
  const remainingFunds = $('#remainingFunds').html()
  const newObj = {
    username: username,
    weeklyIncome: income,
    availableIncome: remainingFunds,
    categories:[]
  }
  const budgets = $('tr.tableData')
  $.each(budgets, function(i, budget){
    let newBudget = {
      table: $(this).closest('table').attr('id'),
      name: $(this).children('th').html(),
      amount: $(this).children('td[contenteditable]').html()
    }
  newObj.categories.push(newBudget)
  })
  newState = newObj;
  updateState()
}

function updateState() {
  const savedState = Object.assign({}, newState, loadedState)
  console.log(savedState)
}

// function formSubmit(event){
  
// }

// save categories as new state
// compare new state to old state
// compile into one state
// send new state to server
// WHEN PAGE LOADS:
// get budget data from server
// populate STATE with data
// use STATE as source for rendering
// rinse, repeat