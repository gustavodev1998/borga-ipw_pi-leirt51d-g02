window.addEventListener('load', loadHandler)

function loadHandler() {
  const buttonUpdate = document.querySelectorAll('.btn_add')
  buttonUpdate.forEach(b => b.addEventListener('click', updateGameGroupHandler))
}

function updateGameGroupHandler() {
  const gameId = this.id.split('_')[1]
  const url = window.location.href
  const groupId = url.split('/')[4]

  const options = {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    },
    body: JSON.stringify({
      gameId: gameId,
      groupId: groupId
    })
  }

  return fetch(`/borgaApi/groups/${groupId}/game/${gameId}`, options)
    .then(res => {
      console.log(res.status)
      if (res.status == 401) return Promise.reject('Unauthorize')
      return res.json()
    })
    .then(body => {
      console.log(body)
      console.log("ola")
      //document.location.href = `/groups/${groupId}`
      window.location.href = `/groups/${groupId}`
    })
    .catch(error => {
      console.log(error)
      alert(error)
    })
}
