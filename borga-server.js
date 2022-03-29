const GROUPS_DATA_HOST = 'localhost:9200'
const ENVIRONMENT_PORT = process.env.PORT

const express = require('express')
const path = require('path')
const app = express()

/* In memory */
const borgaData = require('./borga-data-mem.js')

/* ElasticSearch */
//const borgaData = require('./borga-db.js')
const borgaServices = require('./borga-services.js')(borgaData)
const borgaApiRouter = require('./borga-web-api.js')(
  express.Router(),
  borgaServices
)

const borgaSiteRouter = require('./borga-web-site.js')(
  express.Router(),
  borgaServices
)

const borgaAuthSiteRouter = require('./borga-auth-web-site.js')(
  app,
  express.Router(),
  borgaServices
)

app.use(express.json())
app.use(express.static(path.join(__dirname, '/public')))
app.use(express.urlencoded({ extended: false }))

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'hbs')

app.use('/borgaApi', borgaApiRouter)
app.use('/', borgaAuthSiteRouter)
app.use('/', borgaSiteRouter)

app.listen(ENVIRONMENT_PORT || 8080, () => console.log('Listening...'))
