$('#sign-up-submit').on('submit', createUser);
$('#sign-in-button').on('click', showLogin);
$('.explainer').on('click', '#go-back', goBack);

function createUser(event){
  event.preventDefault();
  const username = $('input[name="username"]').val();
  const password = $('input[name="password"]').val();
  const firstName = $('input[name="first-name"]').val();
  const lastName = $('input[name="last-name"]').val();
  const email = $('input[name="email"]').val();

  const userObject = {
    username: username,
    password: password,
    firstName: firstName,
    lastName: lastName,
    email: email
  }

  const infoSettings = {
    url: 'http://localhost:8080/api/users/newuser',
    type: 'post',
    contentType: 'application/json',
    data: JSON.stringify(userObject),
    success: handleSuccess,
    error: function(err){
      console.log(err)
    }
  };

  function handleSuccess(success){
    $('body').append(
      `<a id="goBackLink" href='/'>Go back, fill out your budget and log in, then click Sign In!</a>`
    )
  }
  console.log(userObject)

  $.ajax(infoSettings)
  .then(function(){alert('User Created!')})
}

function showLogin(event){
  event.preventDefault();

  $('.explainer').html('');
  $('#sign-up-div').html('');

  $('.explainer').append(
    `<div id="sign-in">
      <form id="login-form">
        <input name="username" type="text" placeholder="username">
        <input name="password" type="password" placeholder="password">
        <button type="submit" id="login-button">Sign In</button>
        <button type="button" id="go-back">Go Back</button>   
      </form>
    </div>`
  )
};

function goBack(event){
  event.preventDefault();

  $('.explainer').html('');

  $('.explainer').append(`    
  <h2>Budge My Life is an app meant to simplify the creation of your budget</h2>
  <ul class="col-6 offset-3">Put in:<br>
    <li>How much you have in your account</li> 
    <li>How much you make</li> 
    <li>How much you pay in bills</li> 
    <li>How much you want to save</li> 
  </ul>`);

  $('#sign-up-div').append(`
    <h2 id="sign-up-here" class="col-4 offset-4">Sign Up</h2>
    <form id="sign-up-submit" class="col-4 offset-4">
      <input name="username" type="text" placeholder="username"><br>
      <input name="password" type="password" placeholder="password"><br>
      <input name="first-name" type="text" placeholder="first name"><br>
      <input name="last-name" type="text" placeholder="last name"><br>
      <input name="email" type="email" placeholder="email"><br>
      <button type="submit" class="sign-up-submit">Submit</button>
    </form>
  `);
}