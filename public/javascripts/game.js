window.addEventListener('load', loadHandler)

function loadHandler() {
  const myForm = document.querySelector('.myform_submit')
  myForm.addEventListener('click', searchGameHandler)
}

function searchGameHandler() {
  const myForm = document.querySelector('#myform')
  myForm.submit()
}
