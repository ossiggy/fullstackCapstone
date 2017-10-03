$('#sign-up-submit').on('submit', createUser);

function createUser(event){
  event.preventDefault;
  const username = $('input[name="username"]').val();
  console.log(username)
}