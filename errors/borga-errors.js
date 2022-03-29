module.exports = {
  INVALID_GROUP_ID: invalidGroupId,
  INVALID_GAME_ID: invalidGameId,
  NOT_FOUND: notFound,
  NOT_AUTHORIZE: notAuthorize,
  GAME_ALREADY_EXISTS: gameAlreadyExists,
  NOT_CREATED: notCreated,
  NOT_EDITED: notEdited,
  INVALID_TOKEN: invalidToken,
  INVALID_CREDENTIALS: invalidCredentials,
  USER_NOT_FOUND: userNotFound,
  USERNAME_NOT_CREATE: userNotCreated,
  PASSWORD_INCORRECT: incorrectPassword
}

function invalidGroupId(groupId) {
  return {
    code: 'e1',
    error: `${groupId.toString()} is not a valid Group id`
  }
}

function invalidGameId(gameId) {
  return {
    code: 'e1',
    error: `${gameId.toString()} is not a valid Game id`
  }
}

function gameAlreadyExists(gameId) {
  return {
    code: 'e1',
    error: `The game with id = ${gameId.toString()} already exists in this group`
  }
}

function notCreated() {
  return {
    code: 'e1',
    error: `name is required`
  }
}

function userNotCreated() {
  return {
    code: 'e1',
    error: `Username alredy exists`
  }
}

function notEdited() {
  return {
    code: 'e1',
    error: `Group not edited, please insert some alteration`
  }
}

function invalidToken() {
  return {
    code: 'e2',
    error: `Must authenticate`
  }
}

function notAuthorize() {
  return {
    code: 'e3',
    error: `is not authorize`
  }
}

function notFound(id) {
  return {
    code: 'e4',
    error: `${id} not found`
  }
}

function userNotFound(name) {
  return {
    code: 'e1',
    error: `Username: ${name} doesn't exists`
  }
}

function invalidCredentials(id) {
  return {
    code: 'e2',
    error: `${id} not found`
  }
}

function incorrectPassword() {
  return {
    code: 'e2',
    error: 'Your password is incorrect'
  }
}
