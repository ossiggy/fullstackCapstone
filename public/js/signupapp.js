$('#sign-up-submit').on('submit', createUser);

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
      `<a id="goBackLink" href='/'>Go Back to Sign In and Fill Out My Budget!</a>`
    )
  }
  console.log(userObject)

  $.ajax(infoSettings)
  .then(function(){alert('User Created!')})
}
