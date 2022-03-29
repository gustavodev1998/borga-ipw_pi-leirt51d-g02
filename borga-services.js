const errors = require('./errors/borga-errors')
const gamesData = require('./board-games-data')

module.exports = function (borgaData) {
  return {
    createUser: createUser,
    getAllGames: getAllGames,
    createGroup: createGroup,
    getAllGroups: getAllGroups,
    editGroup: editGroup,
    getGroupById: getGroupById,
    deleteGroupById: deleteGroupById,
    addGameIntoGroup: addGameIntoGroup,
    deleteGameFromGroup: deleteGameFromGroup,
    validateUser: validateUser
  }

  //DONE
  function validateUser(userName, password) {
    return borgaData.getUserByUsername(userName).then(user => {
      if (!user) return Promise.reject(errors.INVALID_CREDENTIALS(userName))
      if (password === user.password)
        return Promise.resolve({
          userName: user.userName,
          password: user.password,
          token: user.token
        })
      else return Promise.reject(errors.PASSWORD_INCORRECT())
    })
  }

  //DONE
  function createUser(name, password) {
    return borgaData
      .createUser(name, password)
      .then(user => Promise.resolve(user))
      .catch(error => Promise.reject(error))
  }

  //DONE
  function getAllGames(name) {
    return borgaData
      .getAllGames(name)
      .then(g => Promise.resolve(g))
      .catch(error => Promise.reject(error))
  }

  //DONE
  function createGroup(name, description, token) {
    var splitedToken
    try {
      splitedToken = token.split(' ')
    } catch (err) {
      return Promise.reject(errors.INVALID_TOKEN())
    }
    if (splitedToken[0] != 'Bearer')
      return Promise.reject(errors.NOT_AUTHORIZE())

    return borgaData
      .getUserByToken(splitedToken[1])
      .then(user => borgaData.createGroup(name, description, user.userName))
      .catch(error => Promise.reject(error))
  }

  //DONE
  function getAllGroups(token) {
    try {
      splitedToken = token.split(' ')
    } catch (err) {
      return Promise.reject(errors.INVALID_TOKEN())
    }
    if (splitedToken[0] != 'Bearer') return Promise.reject(errors.INVALID_TOKEN)

    return borgaData
      .getUserByToken(splitedToken[1])
      .then(user => {
        return borgaData.getAllGroups(user.userName)
      })
      .catch(error => Promise.reject(error))
  }

  //DONE
  function getGroupById(groupId, token) {
    try {
      splitedToken = token.split(' ')
    } catch (err) {
      return Promise.reject(errors.INVALID_TOKEN())
    }
    if (splitedToken[0] != 'Bearer') return Promise.reject(errors.INVALID_TOKEN)

    if (!groupId) return Promise.reject(errors.INVALID_GROUP_ID())

    return borgaData
      .getUserByToken(splitedToken[1])
      .then(user => borgaData.getGroupById(user.userName, groupId))
      .catch(error => Promise.reject(error))
  }

  //DONE
  function editGroup(groupId, name, description, token) {
    try {
      splitedToken = token.split(' ')
    } catch (err) {
      return Promise.reject(errors.INVALID_TOKEN())
    }
    if (splitedToken[0] != 'Bearer') return Promise.reject(errors.INVALID_TOKEN)

    if (!groupId) return Promise.reject(errors.INVALID_GROUP_ID())

    return borgaData
      .getUserByToken(splitedToken[1])
      .then(user => borgaData.getGroupById(user.userName, groupId))
      .then(group => borgaData.editGroup(group, name, description))
      .catch(error => Promise.reject(error))
  }

  //DONE
  function deleteGroupById(groupId, token) {
    try {
      splitedToken = token.split(' ')
    } catch (err) {
      return Promise.reject(errors.INVALID_TOKEN())
    }
    if (splitedToken[0] != 'Bearer') return Promise.reject(errors.INVALID_TOKEN)

    if (!groupId) return Promise.reject(errors.INVALID_GROUP_ID())
    return borgaData
      .getUserByToken(splitedToken[1])
      .then(user => borgaData.getGroupById(user.userName, groupId))
      .then(group => borgaData.deleteGroupById(group))
      .catch(error => Promise.reject(error))
  }

  //DONE
  function addGameIntoGroup(groupId, gameId, token) {
    try {
      splitedToken = token.split(' ')
    } catch (err) {
      return Promise.reject(errors.INVALID_TOKEN())
    }
    if (splitedToken[0] != 'Bearer') return Promise.reject(errors.INVALID_TOKEN)

    if (!groupId) return Promise.reject(errors.INVALID_GROUP_ID(groupId))
    if (!gameId) return Promise.reject(errors.INVALID_GAME_ID(gameId))

    return gamesData.getGameById(gameId).then(game =>
      borgaData
        .getUserByToken(splitedToken[1])
        .then(user => borgaData.getGroupById(user.userName, groupId))
        .then(group => borgaData.addGameIntoGroup(group, game[0]))
    )
  }

  function deleteGameFromGroup(groupId, gameId, token) {
    try {
      splitedToken = token.split(' ')
    } catch (err) {
      return Promise.reject(errors.INVALID_TOKEN())
    }
    if (splitedToken[0] != 'Bearer') return Promise.reject(errors.INVALID_TOKEN)

    if (!groupId) return Promise.reject(errors.INVALID_GROUP_ID(groupId))
    if (!gameId) return Promise.reject(errors.INVALID_GAME_ID(gameId))

    return gamesData
      .getGameById(gameId)
      .then(game =>
        borgaData
          .getUserByToken(splitedToken[1])
          .then(user => borgaData.getGroupById(user.userName, groupId))
          .then(group => borgaData.deleteGameFromGroup(group, game[0]))
          .catch(error => Promise.reject(error))
      )
      .catch(error => Promise.reject(error))
  }
}
