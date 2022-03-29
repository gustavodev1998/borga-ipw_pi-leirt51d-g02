const errors = require('./errors/borga-errors')
const gamesData = require('./board-games-data')
const fetch = require('node-fetch')
const crypto = require('crypto')

const baseURL = 'http://localhost:9200/'

module.exports = {
  getUserByUsername: getUserByUsername,
  getUserByToken: getUserByToken,
  createUser: createUser,
  getAllGames: getAllGames,
  createGroup: createGroup,
  getAllGroups: getAllGroups,
  getGroupById: getGroupById,
  editGroup: editGroup,
  deleteGroupById: deleteGroupById,
  addGameIntoGroup: addGameIntoGroup,
  deleteGameFromGroup: deleteGameFromGroup
}

//DONE
function getUserByUsername(userName) {
  return fetch(baseURL + `users/_search?q=userName:${userName}`, {
    headers: { Accept: 'application/json' }
  })
    .then(response => response.json())
    .catch(error => console.log(error))
    .then(body =>
      body.hits.hits.map(t => {
        return {
          userName: t._source.userName,
          password: t._source.password,
          token: t._source.token
        }
      })
    )
    .then(user => user[0])
    .catch(error => console.log(error))
}

//DONE
function getUserByToken(token) {
  return fetch(baseURL + `users/_search?q=token:${token}`, {
    headers: { Accept: 'application/json' }
  })
    .then(response => {
      return response.json()
    })
    .catch(error => console.log(error))
    .then(body =>
      body.hits.hits.map(t => {
        return { userName: t._source.userName, password: t._source.password }
      })
    )
    .then(user => user[0])
    .catch(error => console.log(error))
}

//DONE
function createUser(name, password) {
  const userToken = crypto.randomUUID()
  const body = {
    userName: name,
    password: password,
    token: userToken
  }
  return fetch(baseURL + `users/_doc?refresh=wait_for`, {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    }
  })
    .then(() =>
      Promise.resolve({ userName: name, password: password, token: userToken })
    )
    .catch(error => Promise.reject(error))
}

//DONE
function getAllGames(name) {
  return gamesData
    .fetchGames(name)
    .then(result => Promise.resolve(result))
    .catch(error => Promise.reject(error))
}

//DONE
function createGroup(name, description, userName) {
  const body = {
    name: name,
    description: description,
    games: [],
    userName: userName
  }

  return fetch(baseURL + `groups/_doc?refresh=wait_for`, {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    }
  })
    .then(response => response.json())
    .then(result => {
      return {
        id: result._id,
        name: name,
        description: description,
        games: [],
        userName: userName
      }
    })
}

//DONE
function getAllGroups(userName) {
  return fetch(baseURL + `groups/_search?q=userName:${userName}`, {
    headers: { Accept: 'application/json' }
  })
    .then(response => response.json())
    .then(body =>
      body.hits.hits.map(t => {
        return {
          id: t._id,
          name: t._source.name,
          description: t._source.description,
          games: t._source.games,
          userName: t._source.userName
        }
      })
    )
}

//DONE
function getGroupById(userName, groupId) {
  return fetch(baseURL + `groups/_search?q=userName:${userName}`, {
    headers: { Accept: 'application/json' }
  })
    .then(response => response.json())
    .then(body => {
      return body.hits.hits
        .filter(t => t._id == groupId)
        .map(t => {
          return {
            id: t._id,
            name: t._source.name,
            description: t._source.description,
            games: t._source.games,
            userName: t._source.userName
          }
        })
    })
    .then(group => group[0])
}

//DONE
function editGroup(group, name, description) {
  if (!name) Promise.reject(errors.NOT_CREATED())
  if (!name && !description) Promise.reject(errors.NOT_EDITED())

  group.name = name
  group.description = description

  return fetch(baseURL + `groups/_doc/${group.id}?refresh=wait_for`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    },
    body: JSON.stringify(group)
  })
    .then(res => {
      if (res.status == 401) return Promise.reject('Unauthorize')
      return Promise.resolve(group)
    })
    .catch(error => Promise.reject(error))
}

//DONE
function deleteGroupById(group) {
  return fetch(baseURL + `groups/_doc/${group.id}?refresh=wait_for`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    }
  })
    .then(res => {
      if (res.status == 401) return Promise.reject('Unauthorize')
      return Promise.resolve(group)
    })
    .catch(error => Promise.reject(error))
}

//DONE
function addGameIntoGroup(group, game) {
  const aux = group
  const filteredAux = aux.games.filter(g => g.id == game.id)

  if (filteredAux.length == 0) group.games.push(game)

  return fetch(baseURL + `groups/_doc/${group.id}?refresh=wait_for`, {
    method: 'PUT',
    body: JSON.stringify(group),
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    }
  })
    .then(res => {
      if (res.status == 401) return Promise.reject('Unauthorize')
      return Promise.resolve(bodyParams)
    })
    .catch(error => Promise.reject(error))
}

//DONE
function deleteGameFromGroup(group, game) {
  group.games.pop(game)

  return fetch(baseURL + `groups/_doc/${group.id}?refresh=wait_for`, {
    method: 'PUT',
    body: JSON.stringify(group),
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    }
  })
    .then(res => {
      if (res.status == 401) return Promise.reject('Unauthorize')
      return Promise.resolve(bodyParams)
    })
    .catch(error => Promise.reject(error))
}
