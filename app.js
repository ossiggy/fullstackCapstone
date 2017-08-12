$(document).ready(loadState)

$('body').on('focus', '[contenteditable]', function() {
    var $this = $(this);
    $this.data('before', $this.html());
    return $this;
}).on('blur keyup paste input', '[contenteditable]', function() {
    var $this = $(this);
    if ($this.data('before') !== $this.html()) {
        $this.data('before', $this.html());
        $this.trigger('change');
    }
    if($this.hasClass('amount')){
      doBalance($this);
      remainingFunds();
    }
    if($this.hasClass('income')){
      remainingFunds();
    }
});

$('#pay-day').on('click', payDay)
$('#pay-it').on('click', payBill)
$('form').on('submit', saveState);

// extract value from user object
// have a form compile data from our table to submit

let STATE = {}
let loadedState = {}

function doBalance(amount){
    var amountValue = Number(amount.html())
    var balance = Number(amount.parent().children('td.balance').html())
    // 0 will eventually be replaced by the user's saved balance state
    balance=0+amountValue
    amount.parent().children('td.balance').html(balance)
}

function remainingFunds(){
  var income = Number($("#income").html())
  var totalSpent = 0
  $(".amount").each(function(){
    var newNum = Number($(this).html())
    totalSpent+=newNum
  })
  var remainingFunds = income - totalSpent
  $("#remainingFunds").html(remainingFunds)
}

function payBill(event){
  $.getJSON('./seed-data.json', function(response){
    console.log(response)
  })
}

function payDay(event){
  $.getJSON('./seed-data.json', function(response){
    weeklyIncome = response.weeklyIncome
    availableIncome = response.availableIncome
    availableIncome += weeklyIncome
    console.log(availableIncome)
  })
}

// function saveState(event) {
//   event.preventDefault()
//   const savedState = Object.assign({}, newState, loadedState)
//   alert("Information Saved!")
// }

function loadState(event){
  // var url = "/budgets/:id"
  $.getJSON("./seed-data.json", function(response){
    storeLocally(response)
    remainingFunds()
	})
}

function storeLocally(state) {
  loadedState = state
  render(loadedState)
}

function render(state){
  $(".income").html(`${state.availableIncome}`)
    for(var i=0; i<state.categories.length; i++){
      show(state.categories[i])
    }
}

function show(category){
$(`#${category.table}`).append(
        `<tr>
        <th>${category.name}</th>
        <td contenteditable="true" class="changeable amount" data-column="amount">0</td>
        <td class="button"><button id="pay-it">Pay It</button></td>
        </tr>`)
}
        // <td contenteditable="true" class="changeable goal" data-column="goal">${category.goal}</td>
        // <td contenteditable="false" class="balance" data-column="balance">${category.balance}</td>

// WHEN USER SAVES:

// search for cells with `data-` attr
// use the names of each `data-` attr to make obj key
// use the text contents of those cells to get the value

// $("button").on("click", formSubmit)

const newState = {}

function saveState(e){
  event.preventDefault()
  var fields = $("td[contenteditable]")
  $.each(fields, function(i, field) {
    const fieldName = field.dataset.column;
    newState[fieldName] = field.textContent;
  })
  console.log(newState)
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


