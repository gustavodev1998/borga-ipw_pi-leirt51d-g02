const errors = require('./errors/http-errors')
const borgaErrors = require('./errors/borga-errors')

function promiseToResponse(resp, promise, statusCode) {
  return promise
    .then(user => {
      return resp.status(statusCode).json(user)
    })
    .catch(error => {
      const httpError = errors.convertToHttpError(error)
      resp.status(httpError.status).json(httpError.body)
    })
}

module.exports = function (router, borgaServices) {
  /* USERS */
  router.post('/users', createUser)

  /* GAMES */
  router.get('/games', getAllGames)

  /* GROUPS */
  router.post('/groups', createGroup)
  router.get('/groups', getAllGroups)

  /* GROUPS with ID */
  router.put('/groups/:groupId', editGroup)
  router.get('/groups/:groupId', getGroupById)
  router.delete('/groups/:groupId', deleteGroupById)

  /* GROUPS WITH ID & GAME WITH ID */
  router.put('/groups/:groupId/game/:gameId', addGameIntoGroup)
  router.delete('/groups/:groupId/game/:gameId', deleteGameFromGroup)

  return router

  function createUser(req, resp) {
    const promise = borgaServices.createUser(
      getUserName(req),
      getUserPassword(req)
    )
    promiseToResponse(resp, promise, 201)
  }

  //DONE
  function getAllGames(req, resp) {
    const promise = borgaServices.getAllGames(req.query.name)
    promiseToResponse(resp, promise, 200)
  }

  function createGroup(req, resp) {
    var promise
    if (req.header('Authorization')) {
      promise = borgaServices.createGroup(
        req.body.name,
        req.body.description,
        req.header('Authorization')
      )
    } else {
      promise = Promise.reject(borgaErrors.INVALID_TOKEN())
    }

    promiseToResponse(resp, promise, 201)
  }

  function getAllGroups(req, resp) {
    var promise
    if (req.header('Authorization')) {
      promise = borgaServices.getAllGroups(req.header('Authorization'))
    } else {
      promise = Promise.reject(borgaErrors.INVALID_TOKEN())
    }
    promiseToResponse(resp, promise, 200)
  }

  function getGroupById(req, resp) {
    var promise
    if (req.header('Authorization')) {
      promise = borgaServices.getGroupById(
        req.params.groupId,
        req.header('Authorization')
      )
    } else {
      promise = Promise.reject(borgaErrors.INVALID_TOKEN())
    }
    promiseToResponse(resp, promise, 200)
  }

  function editGroup(req, resp) {
    var token = getToken(req)

    var promise
    if (token) {
      promise = borgaServices.editGroup(
        req.params.groupId,
        req.body.name,
        req.body.description,
        token
      )
    } else {
      promise = Promise.reject(borgaErrors.INVALID_TOKEN())
    }

    promiseToResponse(resp, promise, 200)
  }

  function deleteGroupById(req, resp) {
    var token = getToken(req)

    var promise
    if (token) {
      promise = borgaServices.deleteGroupById(req.params.groupId, token)
    } else {
      promise = Promise.reject(borgaErrors.INVALID_TOKEN())
    }

    promiseToResponse(resp, promise, 200)
  }

  function addGameIntoGroup(req, resp) {
    var token = getToken(req)

    var promise
    if (token) {
      promise = borgaServices.addGameIntoGroup(
        req.params.groupId,
        req.params.gameId,
        token
      )
    } else {
      promise = Promise.reject(borgaErrors.INVALID_TOKEN())
    }

    promiseToResponse(resp, promise, 200)
  }

  function deleteGameFromGroup(req, resp) {
    var token = getToken(req)

    var promise
    if (token) {
      promise = borgaServices.deleteGameFromGroup(
        req.params.groupId,
        req.params.gameId,
        token
      )
    } else {
      promise = Promise.reject(borgaErrors.INVALID_TOKEN())
    }
    promiseToResponse(resp, promise, 200)
  }

  function getToken(req) {
    return req.user && 'Bearer ' + req.user.token
  }

  function getUserName(req) {
    return req.user && req.user.userName
  }

  function getUserPassword(req) {
    return req.user && req.user.password
  }
}
