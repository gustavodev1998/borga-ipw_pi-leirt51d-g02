const crypto = require('crypto')
const gamesData = require('./board-games-data')
const errors = require('./errors/borga-errors')

const users = [
  {
    userName: 'Gustavo',
    password: 'admin',
    token: '3fa85f64-5717-4562-b3fc-2c963f66afa6'
  },
  {
    userName: 'Tiago',
    password: '1234',
    token: '3fa85f64-5717-4562-b3fc-2c963f66afa7'
  },
  {
    userName: 'Ines',
    password: '9876',
    token: '3fa85f64-5717-4562-b3fc-2c963f66afa8'
  }
]

const groups = [
  {
    id: 1,
    name: 'GroupOfGustavo',
    description: 'group1',
    games: [],
    userName: 'Gustavo'
  },
  {
    id: 2,
    name: 'GroupOfTiago',
    description: 'group2',
    games: [],
    userName: 'Tiago'
  },
  {
    id: 3,
    name: 'GroupOfInes',
    description: 'group3',
    games: [],
    userName: 'Ines'
  }
]

let nextId = 4

module.exports = {
  getUserByToken: getUserByToken,
  createUser: createUser,
  getAllGames: getAllGames,
  createGroup: createGroup,
  getAllGroups: getAllGroups,
  editGroup: editGroup,
  getGroupById: getGroupById,
  deleteGroupById: deleteGroupById,
  addGameIntoGroup: addGameIntoGroup,
  deleteGameFromGroup: deleteGameFromGroup,
  getUserByUsername: getUserByUsername
}

function getUserByUsername(userName) {
  const user = users.find(u => u.userName == userName)
  if (!user) return Promise.reject(errors.USER_NOT_FOUND(userName))
  return Promise.resolve(user)
}

function getUserByToken(token) {
  if (!token) return Promise.reject(errors.INVALID_TOKEN())

  const user = users.find(u => u.token == token)
  if (!user) return Promise.reject(errors.NOT_AUTHORIZE())

  return Promise.resolve(user)
}

function createUser(name, password) {
  if (!name || !password) return Promise.reject(errors.NOT_CREATED())

  const userExist = users.find(u => u.userName == name)
  if (userExist) return Promise.reject(errors.USERNAME_NOT_CREATE())

  const userToken = crypto.randomUUID()
  const newUser = {
    userName: name,
    password: password,
    token: userToken
  }

  users.push(newUser)

  return Promise.resolve(newUser)
}

function getAllGames(name) {
  return gamesData
    .fetchGames(name)
    .then(result => Promise.resolve(result))
    .catch(error => Promise.reject(error))
}

function createGroup(name, description, userName) {
  if (!name) return Promise.reject(errors.NOT_CREATED())

  const newId = nextId++
  const newGroup = {
    id: newId,
    name: name,
    description: description,
    games: [],
    userName: userName
  }

  groups.push(newGroup)

  return Promise.resolve(newGroup)
}

function getAllGroups(userName) {
  //204
  const allGroups = groups.filter(g => g.userName == userName)
  return Promise.resolve(allGroups)
}

function getGroupById(userName, groupId) {
  const group = groups.find(g => g.id == groupId && g.userName == userName)
  if (!group) return Promise.reject(errors.NOT_FOUND(groupId))

  return Promise.resolve(group)
}

function editGroup(group, name, description) {
  if (!name && !description) return Promise.reject(errors.NOT_EDITED())

  if (name) group.name = name
  if (description) group.description = description

  return Promise.resolve(group)
}

function deleteGroupById(group) {
  const i = groups.indexOf(group) + 1
  if (!i) return Promise.reject(errors.NOT_FOUND(group.id))

  groups.splice(i - 1, 1)
  return Promise.resolve(group)
}

function addGameIntoGroup(group, game) {
  const test = group.games.find(g => g.id == game.id)
  if (test) return Promise.reject(errors.GAME_ALREADY_EXISTS(game.id))

  group.games.push(game)
  return Promise.resolve(group)
}

function deleteGameFromGroup(group, game) {
  const i = group.games.indexOf(g => g.id == game.id)
  if (!i) return Promise.reject(errors.NOT_FOUND(game.id))

  group.games.splice(i, 1)
  return Promise.resolve(group)
}
