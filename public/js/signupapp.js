$('#sign-up-submit').on('submit', createUser);
$('#sign-in-button').on('click', showLogin);
$('.explainer').on('click', '#go-back', goBack);
$('.demo-mode').on('click', signInDemo)

function createUser(event){
  event.preventDefault();
  console.log('creating')
  const username = $('input[name="username"]').val();
  const password = $('input[name="password"]').val();
  const email = $('input[name="email"]').val();

  const userObject = {
    username: username,
    password: password,
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
    $.ajax(infoSettings)
    .then(function(){alert('User Created!')})
  }
}  


function showLogin(event){
  event.preventDefault();

  $('.explainer').html('');
  $('#sign-up-div').html('');

  $('.explainer').append(
    `<div id="sign-in">
      <form id="login-form">
        <div class="input-div col-12">
          <input name="username" type="text" placeholder="username">
          <input name="password" type="password" placeholder="password">
          <button type="button" id="login-button">Sign In</button>
          <button type="button" id="go-back">Go Back</button>  
        </div> 
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
      <input name="email" type="email" placeholder="email"><br>
      <button type="submit" class="sign-up-submit">Submit</button>
    </form>
  `);
}

function signInDemo(event){
  event.preventDefault();

  const loginURL = '/api/auth/login';
  const username = 'demo';
  const password = '12345678'

  const formData = {
    username: username,
    password: password
  }
  
    function setHeader(req){
      const encodedString = btoa(`${username}:${password}`);
      req.setRequestHeader('Authorization', 'Basic ' + encodedString);
    }
  
    function handleSuccess(res){
  
      Cookies.set('authToken', res.authToken);
      Cookies.set('userId', res.id);
  
      $.get('api/users/'+res.id)
        .then(res => {
          console.log(res);
          Cookies.set('username', res.username);
        });
      $('#sign-in').append(
        `<h3 class='welcome'>Welcome ${username}!</h3>`
      );
    }
  
    const infoSettings = {
      url: loginURL,
      type: 'POST',
      beforeSend: setHeader,
      data: formData,
      success: handleSuccess,
      error: function(err){
        console.log(err);
      }
    };
  
   document.location = '/budget';
  
    $.ajax(infoSettings);
    $('#login-form').addClass('hidden');
    $('#submit').removeClass('hidden');
}