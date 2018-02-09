'use strict';

$('#login-form').on('submit', function(event){
  event.preventDefault();
  this.childNodes[5].disabled = true;
  const formData = {};

  $('#login-form input').each(function(){
    let {name, value} = this;
    formData[name] = value;
  });
  userLogin(formData);
});

function userLogin(formData){

  const loginURL = '/api/auth/login';

  const {username, password} = formData;

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

  $.ajax(infoSettings);
  $('#login-form').addClass('hidden');
  $('#submit').removeClass('hidden');
}

