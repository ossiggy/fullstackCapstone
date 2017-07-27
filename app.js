$(".changeable").on("blur", updateState)

// will also need a function that takes each change and, if change is made in certain
// column, add or subtract from monthly income, remaining funds, and total bill
// amount left over, respectively

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
  var value = changedContents.html()
  console.log(value)
  if(changedContents.hasClass("amount")){
    var income = $("#income").value
  }
  if(changedContents.hasClass("due-date")){

  }
  if(changedContents.hasClass("balance")){

  }
}

