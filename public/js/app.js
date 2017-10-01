$(document).ready(loadState)
$('#pay-day').on('click', payDay)
$('#budget-form').on('click','.pay-it', payBill)
$('#budget-form').on('submit', createState);
$('.add-row').on('click', addRow)
$('.del-row').on('click', delRow)
$('form').on('click','.undo', undo)
$('#un-pay').on('click', unPay)

let loadedState = {}

function loadState(event){
  // var url = "/budgets/:id"
  $.getJSON("../../seed-data.json", function(response){
    storeLocally(response)
	})
}

function storeLocally(state) {
  loadedState = state
  render(loadedState)
}

function render(state){
  $('#sign-in').append(
    `<h3 class='welcome'>welcome ${state.username}</h3>
      <div id='username' class='hidden'>${state.username}</div>`
  )
  $('#income').html(`${state.weeklyIncome}`)
  $('#remaining-funds').html(`${state.availableIncome}`)
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
          <td><button type="button" class="undo">Undo</button></td>
        </tr>`)
}

function payBill(event){
  event.preventDefault()
  let remainingFunds = Number($('#remaining-funds').html())
  let amount = Number($(this).parent().siblings('td[data-column="amount"]').html())
    remainingFunds -= amount
    $('#remaining-funds').html(remainingFunds)
    let billsPaid = Number($('#bills-paid').html())
    billsPaid += amount
    $('#bills-paid').html(billsPaid)
  this.disabled = true
}

function undo(event){
  event.preventDefault()
  this.parentNode.parentNode.childNodes[5].childNodes[0].disabled = false
  let remainingFunds = Number($('#remaining-funds').html())
  let amount = Number($(this).parent().siblings('td[data-column="amount"]').html())
  let actualRemaining = remainingFunds - loadedState.availableIncome
  remainingFunds += amount
  $('#remaining-funds').html(remainingFunds)
  if(remainingFunds>=loadedState.availableIncome){
    $('#remaining-funds').html(loadedState.availableIncome)
  }
  billsPaid = Number($('#bills-paid').html())
  billsPaid -= amount
  $('#bills-paid').html(billsPaid)
  if(billsPaid<actualRemaining){ 
    $('#bills-paid').html(actualRemaining)
  }
}

function payDay(event){
  event.preventDefault()
  let income = Number($('#income').html())
  let remainingFunds = Number($('#remaining-funds').html())
  $('#remaining-funds').html(income+=remainingFunds)
  this.disabled = true
}

function unPay(event) {
  event.preventDefault()
  let income = Number($('#income').html())
  let remainingFunds = Number($('#remaining-funds').html())
  $('#remaining-funds').html(income=remainingFunds-income)
  if(remainingFunds<=loadedState.availableIncome){
    $('#remaining-funds').html(loadedState.availableIncome)
  }
  this.parentNode.childNodes[4].disabled = false
}

function addRow(event){
  event.preventDefault();
  let table = $(this).closest('table')
  table.append(
      `<tr class="tableData">
          <th contenteditable="true" class="changeable name" data-table="" id=""></th>
          <td contenteditable="true" class="changeable amount" data-category="" data-column="amount"></td>
          <td><button type="button" class="pay-it">Paid</button></td>
          <td><button type="button" class="undo">Undo</button></td>
        </tr>`
  )
}

function delRow(event){
  event.preventDefault();
  let table = $(this).closest('table')
  table.children().children('.tableData').last().remove()
}

function createState(event){
  event.preventDefault()
  const objIdArray = []
  const username = $('#username').html()
  const income = $('#income').html()
  const remainingFunds = $('#remaining-funds').html()
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
  console.log(object)
  //post request make assumptions about the request (aka urlencoded responses) while 
  //ajax requests will be custom made requests that you can design for you
  $.ajax({
    url: "http://localhost:8080/budgets",
    type: "post",
    contentType: "application/json",
    data: JSON.stringify(object)
  })
  .then(function(){console.log('success')})
  // alert('Budget updated!')
}

function logMeIn() {
  $.ajax({
    url: '', //server route for login,
    type: post,
    beforeSend: req => {
      // we must add a header that jwt will use to authorize us
      
    }  
  })
}