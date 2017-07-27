$(".changeable").on("blur", updateState)

// will also need a function that takes each change and, if change is made in certain
// column, add or subtract from monthly income, remaining funds, and total bill
// amount left over, respectively

function updateState(event){
  var target = $(event.target);
  var contents = target.html()
  if(contents!=$(this).html()){
    contents = $(this).html()
  }
}

function checkChangeLocation(change){
  if(change.className===)
}