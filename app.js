$(".changeable").on("blur", updateState)
$("#income").on("blur", rebalance)
// will also need a function that takes each change and, if change is made in certain
// column, add or subtract from monthly income, remaining funds, and total bill
// amount left over, respectively

let amountTotal = 0

function updateState(event){
  var target = $(event.target)
  var contents = target.html()
  if(contents!=$(this).html()){
    contents = $(this).html()
  }
  // console.log(Object.keys(target))
  checkClass(target)
}

function checkClass(changedContents){
  var value = Number(changedContents.html())
  var income = Number($("#income").html())
  if(changedContents.hasClass("amount")&&Number.isInteger(value)){
    amountTotal = value + amountTotal
    remainingFunds = income-amountTotal
    $("#remainingFunds").html(remainingFunds)
  }
  else{
    console.log("not a number!")
  }
  // if(changedContents.hasClass("due-date")){

  // }
  // if(changedContents.hasClass("balance")){

  // }
}

function rebalance(event){
  var income = $(event.target).html()
  var amount = $(".amount")
  $("#remainingFunds").html(income-amountTotal)
}
