window.addEventListener('load', loadHandler)

function loadHandler() {
  const buttonsDelete = document.querySelectorAll('.btn_delete')
  buttonsDelete.forEach(b => b.addEventListener('click', deleteGroupHandler))
}

function deleteGroupHandler() {
  const id = this.id.split('_')[1]
  const row = document.getElementById('groupRow_' + id)
  const options = {
    method: 'DELETE',
    headers: { Accept: 'application/json' }
  }
  fetch(`/borgaApi/groups/${id}`, options)
    .then(res => {
      console.log(res.status)
      return res.json()
    })
    .then(body => {
      console.log(body)
      row.remove()
      var table = document.querySelector('#group_table')
      if(table.rows.length == 1) {
        table.style.display = 'none'
        document.querySelector('.title').innerHTML = 'You dont have any groups'
      }
      
    })
    .catch(error => console.log(error))
}
