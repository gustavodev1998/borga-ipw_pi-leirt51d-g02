window.addEventListener('load', loadHandler)

function loadHandler() {
  const buttonDelete = document.querySelectorAll('.btn_delete')
  buttonDelete.forEach(b => b.addEventListener('click', deleteGameGroupHandler))
}

function deleteGameGroupHandler() {
  const gameId = this.id.split('_')[1]
  const url = window.location.href
  const groupId = url.split('/')[4]
  const row = document.getElementById('gameRow_' + gameId)
  const counterRows = document.querySelectorAll('.gameRow')

  const options = {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    }
  }

  fetch(`/borgaApi/groups/${groupId}/game/${gameId}`, options)
    .then(res => {
      console.log(res.status)
      if (res.status == 401) return Promise.reject('Unauthorize')
      return res.json()
    })
    .then(body => {
      console.log(body)
      if (counterRows.length == 1) {
        row.parentNode.remove()

        document.querySelector('#home').classList.add('homeStyle')
        document.querySelector('.group_info_title').children[3].innerHTML ='This group has no games'

        const group_btns = document.querySelector('#group_btns').classList

        group_btns.add('groups_btn-direction')
        group_btns.remove('withGameButton')
        group_btns.add('withNoGameButton')
      } else row.remove()
    })
    .catch(error => {
      console.log(error)
    })
}
