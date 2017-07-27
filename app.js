$(".changeable").on("blur", updateState)
// $("#income").on("blur", rebalance)
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
    if($this.hasClass("amount")){
      doBalance($this);
      totalAmount();
    }
    if($this.hasClass("income")){
      totalAmount();
    }
});
// will also need a function that takes each change and, if change is made in certain
// column, add or subtract from monthly income, remaining funds, and total bill
// amount left over, respectively <--- completed

// extract value from user object balance
// have a form extract data from our table to submit
let amountTotal = 0

function updateState(event){
  var target = $(event.target)
  var contents = target.html()
  if(contents!=$(this).html()){
    contents = $(this).html()
  }
  checkClass(target)
}

function checkClass(changedContents){
  var amountValue = Number(changedContents.html())
  var income = Number($("#income").html())
  if(changedContents.hasClass("amount")&&Number.isInteger(amountValue)){
    // amountTotal = amountValue + amountTotal
    // remainingFunds = income-amountTotal
    // $("#remainingFunds").html(remainingFunds)
  }
}

function doBalance(amount){
    var amountValue = Number(amount.html())
    var balance = Number(amount.parent().children('td.balance').html())
    balance=0+amountValue
    amount.parent().children('td.balance').html(balance)
}

function totalAmount(){
  var income = Number($("#income").html())
  var totalSpent = 0
  $(".amount").each(function(){
    var newNum = Number($(this).html())
    totalSpent+=newNum
  })
  console.log(totalSpent)
  var remainingFunds = income - totalSpent
  $("#remainingFunds").html(remainingFunds)
}