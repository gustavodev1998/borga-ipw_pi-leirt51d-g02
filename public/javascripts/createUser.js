window.addEventListener('load', loadHandler)

function loadHandler() {
  const submitBtn = document.querySelector('#submitBtn')
  submitBtn.addEventListener('click', confirmPasswordHandler)

  const username = document.querySelector('#username')
  username.addEventListener('invalid', invalidHandlerUN)
  username.addEventListener('change', changeHandlerUN)

  const password = document.querySelector('#password')
  password.addEventListener('invalid', invalidHandlerP)
  password.addEventListener('change', changeHandlerP)
}

function confirmPasswordHandler() {
  const password = document.querySelector('#password')
  const confirmPassword = document.querySelector('#confirm_password')

  if (password.value != confirmPassword.value) {
    swal({
      title: "Your passwords doesn't match",
      text: '',
      icon: 'error'
    })
    event.preventDefault()
  } 

}

function invalidHandlerUN() {
  console.log("Estou no Invalid")
  const un = document.querySelector('#username')
  un.setCustomValidity("Please insert a username.")
}

function invalidHandlerP() {
  console.log("Estou no Invalid")
  const p = document.querySelector('#password')
  p.setCustomValidity("Please insert a password.")
}


function changeHandlerUN() {
  const un = document.querySelector('#username')
  un.setCustomValidity('')
}
function changeHandlerP() {
  const p = document.querySelector('#password')
  p.setCustomValidity('')
}




