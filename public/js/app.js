$(document).ready(loadState);
$('#pay-day').on('click', payDay);
$('#budget-form').on('click','.pay-it', payBill);
$('#budget-form').on('submit', createState);
$('.add-row').on('click', addRow);
$('.del-row').on('click', delRow);
$('form').on('click','.undo', undo);
$('#un-pay').on('click', unPay);
$('#got-it').on('click', gotIt);
$('#log-out').on('click', logOut);

const API_BASE_URL = require('../config');

let loadedState = {}

function loadState(event){
  const ID = Cookies.get('userId')
  var url = "/budgets/" + ID
  $.getJSON(url, function(response){
    console.log(response)
    storeLocally(response)
	})
}

function storeLocally(state) {
  loadedState = state
  render(loadedState)
}

function render(state){
  const username = Cookies.get('username')
  const signedInUser = $('.welcome').html()
  const income = $('#income')
  const availableIncome = $('#remaining-funds')
  if(!signedInUser){
    $('#income').html(`${state.weeklyIncome}`)
    $('#vertical-1').children().siblings().children('.tableData').remove()
    $('#vertical-2').children().siblings().children('.tableData').remove()
    $('#remaining-funds').html(`${state.availableIncome}`)
      for(var i=0; i<state.categories.length; i++){
        show(state.categories[i])
      }
  }
    else{
      $('#income').html(`${state.weeklyIncome}`)
      $('#vertical-1').empty()
      $('#vertical-2').empty()
      $('#remaining-funds').html(`${state.availableIncome}`)
        for(var i=0; i<state.categories.length; i++){
          show(state.categories[i])
        }
      }
}

function show(category){
$(`#${category.table}`).append(
        `<tr class="tableData">
          <th contenteditable="true" class="changeable name" data-table="${category.table}" id="${category.name}">${category.name}</th>
          <td contenteditable="true" class="changeable amount" data-category="${category.name}" data-column="amount">${category.amount}</td>
          <td><button type="button" class="pay-it">Paid</button></td>
          <td><button type="button" class="undo" disabled>Undo</button></td>
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
  $(this).css('color', 'green')
  this.disabled = true
  this.parentNode.parentNode.childNodes[7].childNodes[0].disabled = false
}

function undo(event){
  event.preventDefault()
  const payButton = this.parentNode.parentNode.childNodes[5].childNodes[0]
  this.disabled = true
  payButton.disabled = false
  let remainingFunds = Number($('#remaining-funds').html())
  let amount = Number($(this).parent().siblings('td[data-column="amount"]').html())
  let actualRemaining = remainingFunds - loadedState.availableIncome
  remainingFunds += amount
  $('#remaining-funds').html(remainingFunds)
  billsPaid = Number($('#bills-paid').html())
  billsPaid -= amount
  $('#bills-paid').html(billsPaid)
  payButton.style.color = "white"
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
  $('.pay-it').css('color', 'white')
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
  const parent = Cookies.get('userId')
  const username = Cookies.get('username')
  const income = $('#income').html()
  const remainingFunds = $('#remaining-funds').html()
  const budgets = $('tr.tableData')
  const newObj = {
    _parent: parent,
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

function gotIt(event){
  event.preventDefault()
  $('.explainer').addClass('hidden')
}

function updateState(object) {
  const savedState = Object.assign({}, object, loadedState)
  console.log(object)
  //post request make assumptions about the request (aka urlencoded responses) while 
  //ajax requests will be custom made requests that you can design for you
  $.ajax({
    url: `${API_BASE_URL}/budgets`,
    type: "post",
    contentType: "application/json",
    data: JSON.stringify(object)
  })
  .then(function(){
    console.log('success')
    alert('Budget Saved!')
  })
}

function logOut(event){
  event.preventDefault();

  Cookies.set('authToken', '');
  Cookies.set('userId', '');

  document.location = '/';
}