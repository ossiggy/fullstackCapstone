$('#login-form').on(submit, function(event){
  event.preventDefault();
  const formData = {};

  $('#login-form input').each(function(){
    let {name, value} = this;
    formData[name] = value;
  });

  userLogin(formData)
})

function userLogin(formData){

  const loginURL = '/api/auth/login';

  const {username, password} = formData;

  function setHeader(req){
    const encodedString = btoa(`${username}:${password}`);
    req.setRequestHeader('Authorization', 'Basic' + encodedString);
  }

  function handleSuccess(res){
    Cookies.set('authToken', res.authToken);
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
}

