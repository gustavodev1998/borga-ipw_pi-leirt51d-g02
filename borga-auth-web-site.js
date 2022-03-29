const httpErrors = require('./errors/http-errors')
const expressSession = require('express-session')
const passport = require('passport')

module.exports = function (app, router, services) {
  app.use(
    expressSession({ secret: 'PI 2021', resave: true, saveUninitialized: true })
  )
  app.use(passport.initialize())
  app.use(passport.session())

  passport.serializeUser((user, done) => done(null, user))
  passport.deserializeUser((user, done) => done(null, user))

  router.get('/login', getLogin)
  router.post('/login', postLogin)
  router.post('/logout', logout)

  return router

  function getLogin(req, resp) {
    resp.render('login', { pageLoginSpecificCss: true })
  }

  function postLogin(req, resp) {
    const userName = req.body.username
    const password = req.body.password

    services
      .validateUser(userName, password)
      .then(user => login(req, user))
      .then(() => resp.redirect('/groups'))
      .catch(err => {
        httpErr = httpErrors.convertToHttpError(err)
        return resp.render('errorPage', {
          status: httpErr.status,
          msg: httpErr.body.description
        })
      })
  }

  function logout(req, resp) {
    req.logout()
    resp.redirect('/')
  }

  function login(req, user) {
    return new Promise((resolve, reject) => {
      req.login(user, (error, result) => {
        if (error) reject(error)
        else resolve(result)
      })
    })
  }
}
