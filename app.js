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
      remainingFunds();
    }
    if($this.hasClass("income")){
      remainingFunds();
    }
});

// extract value from user object
// have a form compile data from our table to submit

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