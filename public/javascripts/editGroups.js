window.addEventListener('load', loadHandler)

function loadHandler() {
  const buttonUpdate = document.querySelector('#submitBtn')
  buttonUpdate.addEventListener('click', updateTaskHandler)
}

function updateTaskHandler() {
  const groupId = document.querySelector('#group_id').value
  const groupNameText = document.querySelector('#group_name').value
  const groupDescriptionText =
    document.querySelector('#group_description').value

  if (!groupDescriptionText)
    alert('Are you sure you dont want to insert a description?')

  const options = {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    },
    body: JSON.stringify({
      name: groupNameText,
      description: groupDescriptionText
    })
  }

  fetch(`/borgaApi/groups/${groupId}`, options)
    .then(res => {
      console.log(res)
      if (res.status == 401) return Promise.reject('Unauthorize')
      return res.json()
    })
    .then(body => {
      console.log(body)
      document.location.href = `/groups/${groupId}`
    })
    .catch(error => {
      alert('Error: ' + error)
      console.log(error)
    })
}
