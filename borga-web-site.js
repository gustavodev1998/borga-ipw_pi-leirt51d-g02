const httpErrors = require('./errors/http-errors')

function promiseToResponse(resp, promise, statusCode) {
  return promise
    .then(user => resp.status(statusCode).json(user))
    .catch(error => {
      const httpError = httpErrors.convertToHttpError(error)
      resp.status(httpError.status).json(httpError.body)
    })
}

module.exports = function (router, borgaServices) {
  /* HOME PAGE */
  router.get('/', getHomePage)

  /* USER */
  router.post('/users', createUser)
  router.get('/users', getCreateUserPage)

  /* GAMES */
  router.get('/games', getAllGames)

  /* GROUPS */
  router.get('/groups/create', getCreateGroupPage)
  router.post('/groups', createGroup)
  router.get('/groups', getAllGroups)

  /* GROUPS with ID */
  router.get('/groups/:groupId', getGroupById)
  router.get('/groups/:groupId/edit', getEditGroupPage)
  router.get('/groups/:groupId/game', getAllGames)

  // The 404 Route
  router.get('*', notFoundPage)

  return router

  //Get Pages
  function notFoundPage(req, resp) {
    resp.render('errorPage', { status: 404, msg: 'Page not found' })
  }

  function getHomePage(req, resp) {
    resp.render('home', { username: getUserName(req) })
  }

  function getCreateUserPage(req, resp) {
    resp.render('createUser', {
      scriptName: 'createUser',
      username: getUserName(req),
      createUserCss: true
    })
  }

  async function getEditGroupPage(req, resp) {
    try {
      const group = await borgaServices.getGroupById(
        req.params.groupId,
        getToken(req)
      )
      resp.render('editGroup', {
        group: group,
        scriptName: 'editGroups',
        username: getUserName(req)
      })
    } catch (err) {
      httpErr = httpErrors.convertToHttpError(err)
      resp.render('errorPage', {
        status: httpErr.status,
        msg: httpErr.body.description
      })
    }
  }

  function getCreateGroupPage(req, resp) {
    resp.render('createGroup', { username: getUserName(req) })
  }

  //Router Functions

  //Done
  async function createUser(req, resp) {
    requestBody = JSON.parse(JSON.stringify(req.body))
    try {
      await borgaServices.createUser(requestBody.username, requestBody.password)
      resp.redirect(303, '/')
    } catch (err) {
      httpErr = httpErrors.convertToHttpError(err)
      return resp.render('errorPage', {
        status: httpErr.status,
        msg: httpErr.body.description
      })
    }
  }

  //Done
  async function getAllGames(req, resp) {
    var addFlag = false
    const groupId = req.params.groupId
    if (groupId) {
      addFlag = true
      if (!getToken(req))
        return resp.render('errorPage', {
          status: 401,
          msg: 'Must authenticate'
        })
    }

    const games = await borgaServices.getAllGames(req.query.name)
    resp.render('games', {
      username: getUserName(req),
      games: games,
      addFlag: addFlag,
      groupId: groupId,
      scriptName: 'addGroupGame',
      scriptNamePlus: 'game',
      groupGameCss: true
    })
  }

  //Done
  async function createGroup(req, resp) {
    requestBody = JSON.parse(JSON.stringify(req.body))

    const group = await borgaServices.createGroup(
      requestBody.name,
      requestBody.description,
      getToken(req)
    )

    resp.redirect(303, `/groups/${group.id}`)
  }

  //Done
  async function getAllGroups(req, resp) {
    try {
      const groups = await borgaServices.getAllGroups(getToken(req))
      var existsGroups = false

      if (groups.length > 0) existsGroups = true

      resp.render('groups-list', {
        username: getUserName(req),
        scriptName: 'deleteGroups',
        groups: groups,
        existsGroups: existsGroups,
        groupsListCss: true
      })
    } catch (err) {
      httpErr = httpErrors.convertToHttpError(err)
      resp.render('errorPage', {
        status: httpErr.status,
        msg: httpErr.body.description
      })
    }
  }

  //Done
  async function getGroupById(req, resp) {
    var gameFlag = false
    try {
      const group = await borgaServices.getGroupById(
        req.params.groupId,
        getToken(req)
      )

      if (group.games.length > 0) gameFlag = true

      resp.render('group', {
        username: getUserName(req),
        group: group,
        gameFlag: gameFlag,
        scriptName: 'deleteGroupGame',
        groupsCss: true
      })
    } catch (err) {
      httpErr = httpErrors.convertToHttpError(err)
      resp.render('errorPage', {
        status: httpErr.status,
        msg: httpErr.body.description
      })
    }
  }

  /* FUNÇOES PARA HBS */
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

// Funcões nao utilizadas (somente para a 2nd fase do trabalho)
/*  

  async function editGroup(req, resp) {
    const group = await borgaServices.editGroup(
      req.params.groupId,
      req.body.name,
      req.body.description,
      getToken()
    )
    resp.render('group', { group: group[0] })
  }


  async function deleteGroupById(req, resp) {
    const group = await borgaServices.deleteGroupById(
      req.params.groupId,
      getToken()
    )
    resp.render('group', { group: group })
  }

  async function addGameIntoGroup(req, resp) {
    const group = await borgaServices.addGameIntoGroup(
      req.params.groupId,
      req.params.gameId,
      getToken()
    )
    resp.render('group', { group: group })
  }

 
  async function deleteGameFromGroup(req, resp) {
    const group = await borgaServices.deleteGameFromGroup(
      req.params.groupId,
      req.params.gameId,
      getToken()
    )
    resp.render('group', { group: group })
  } */
