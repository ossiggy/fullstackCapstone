$(document).ready(loadState)
$('#pay-day').on('click', payDay)
$('form').on('click','.pay-it', payBill)
$('form').on('submit', createState);
$('.add-row').on('click', addRow)

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
  console.log(this)
  this.disabled = true;
}

function addRow(event){
  event.preventDefault();
  let table = $(this).closest('table')
  $this = ($(this).html())
  table.append(
      `<tr class="tableData">
          <th contenteditable="true" class="changeable name" data-table="" id=""></th>
          <td contenteditable="true" class="changeable amount" data-category="" data-column="amount"></td>
          <td><button type="button" class="pay-it">Paid</button></td>
        </tr>`
  )
}

function createState(event){
  event.preventDefault()
  const objIdArray = []
  const username = $('#username').html()
  const income = $('#income').html()
  const remainingFunds = $('#remainingFunds').html()
  const budgets = $('tr.tableData')
  const newObj = {
    username: username,
    weeklyIncome: income,
    availableIncome: remainingFunds,
    categories:[]
  }
  
  $.each(budgets, function(i, budget){
    let newBudget = {
      table: $(this).closest('table').attr('id'),
      name: $(this).children('th').html(),
      amount: $(this).children('td[contenteditable]').html()
    }
  newObj.categories.push(newBudget)
  })
for(var i=0; i<newObj.categories.length; i++){
  var categoryObject = newObj.categories[i]
  objIdArray.push(categoryObject)
}
  newObj.categories = objIdArray
  updateState(newObj)
}

function updateState(object) {
  const savedState = Object.assign({}, object, loadedState)
  console.log(savedState)
  //post request make assumptions about the request (aka urlencoded responses) while 
  //ajax requests will be custom made requests that you can design for you
  $.ajax({
    url: "http://localhost:8080/budgets",
    type: "post",
    contentType: "application/json",
    data: JSON.stringify(savedState)
  })
  .then(function(){console.log('success')})
  // alert('Budget updated!')
}