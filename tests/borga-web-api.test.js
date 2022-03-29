//npm install supertest --save-dev

const request = require('supertest')
const express = require('express')

/* NOT USED IN ASSIGMENT 3 */
const borgaData = require('../borga-data-mem.js')

//const borgaData = require('./borga-db.js')
const borgaServices = require('../borga-services.js')(borgaData)
const borgaApiRouter = require('../borga-web-api.js')(
  express.Router(),
  borgaServices
)

const app = express()
app.use(express.json())
app.use('/borgaApi', borgaApiRouter)

/* AUTHORIZATION TOKEN TEST */
test('Request without Authorization', () => {
  return request(app)
    .get('/borgaApi/groups/1')
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .expect(401)
    .then(response => {
      expect(response.body).toStrictEqual({ description: 'Must authenticate' })
    })
})

/* USER TESTS */
test('create user passing a name', () => {
  return request(app)
    .post('/borgaApi/users')
    .set('Accept', 'application/json')
    .send({ userName: 'Tiago', password: '1234' })
    .expect('Content-Type', /json/)
    .expect(201)
    .then(response => {
      expect(response.body).toEqual(
        expect.objectContaining({ userName: 'Tiago', password: '1234' })
      )
    })
})

test('failure creating an user without passing a name', () => {
  return request(app)
    .post('/borgaApi/users')
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .expect(400)
    .catch(error =>
      expect(error).toStrictEqual({ code: 'e1', error: 'name is required' })
    )
})

/* GAMES TESTS */
const firstGame = {
  id: 'TAAifFP590',
  name: 'Root',
  url: 'https://www.boardgameatlas.com/game/TAAifFP590/root',
  description:
    '<p>Find adventure in this marvelous asymmetric game. Root provides limitless replay value as you and your friends explore the unique factions all wanting to rule a fantastic forest kingdom. Play as the Marquise de Cat and dominate the woods, extracting its riches and policing its inhabitants, as the Woodland Alliance, gathering supporters and coordinate revolts against the ruling regime, the Eyrie Dynasties, regaining control of the woods while keeping your squabbling court at bay, or as the Vagabond, seeking fame and fortune as you forge alliances and rivalries with the other players. Each faction has its own play style and paths to victory, providing an immersive game experience you will want to play again and again.</p>',
  image:
    'https://s3-us-west-1.amazonaws.com/5cc.images/games/uploaded/1629324760985.jpg',
  mechanics: [
    {
      name: 'Action / Movement Programming'
    },
    {
      name: 'Action Queue'
    },
    {
      name: 'Area Control'
    },
    {
      name: 'Dice Rolling'
    },
    {
      name: 'Engine Building'
    },
    {
      name: 'Hand Management'
    },
    {
      name: 'Point to Point Movement'
    },
    {
      name: 'Race'
    },
    {
      name: 'Variable Player Powers'
    }
  ],
  categories: [
    {
      name: 'Adventure'
    },
    {
      name: 'Animals'
    },
    {
      name: 'Asymmetric'
    }
  ]
}

const firstCatanGame = {
  id: 'OIXt3DmJU0',
  name: 'Catan',
  url: 'https://www.boardgameatlas.com/game/OIXt3DmJU0/catan',
  description:
    '<p>The women and men of your expedition build the first two settlements. Fortunately, the land is rich in natural resources. You build roads and new settlements that eventually become cities. Will you succeed in gaining supremacy on Catan? Barter trade dominates the scene. Some resources you have in abundance, other resources are scarce. Ore for wool, brick for lumber - you trade according to what is needed for your current building projects. Proceed strategically! If you found your settlements in the right places and skillfully trade your resources, then the odds will be in your favor. But your opponents are smart too.</p>\r\n<p>To begin the game, we build the game board using hexagonal terrain tiles. Catan is born - a beautiful island with mountains, pastures, hills, fields, and forests, surrounded by the sea.</p>\r\n<p>Each of us places two small houses on spaces where three terrain hexes meet. They are our starting settlements.</p>\r\n<p>And so it begins. I roll two dice. An “11”! Each terrain hex is marked with a die roll number. Each player who owns a settlement adjacent to a terrain hex marked with the number rolled receives a resource produced by this hex. Hills produce brick, forests produce lumber, mountains produce ore, fields produce grain, and pastures produce wool.</p>\r\n<p>We use these resources to expand across Catan: we build roads and new settlements, or we upgrade our existing settlements to cities. For example, a road costs 1 brick and 1 lumber. If we do not have the necessary resources, we can acquire them by trading with our opponents.</p>\r\n<p>Each settlement is worth 1 victory point and each city is worth 2 victory points. If you expand cleverly, you may be the first player to reach 10 victory points and thus win the game!</p>',
  image:
    'https://s3-us-west-1.amazonaws.com/5cc.images/games/uploaded/1629324722072.jpg',
  mechanics: [
    {
      name: 'Dice Rolling'
    },
    {
      name: 'Network and Route Building'
    },
    {
      name: 'Trading'
    }
  ],
  categories: [
    {
      name: 'Dice'
    },
    {
      name: 'Economic'
    },
    {
      name: 'Family Game'
    },
    {
      name: 'Negotiation'
    }
  ]
}

test('success on getting the first game of allGames', () => {
  return request(app)
    .get('/borgaApi/games')
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .expect(200)
    .then(response => response.body)
    .then(games => {
      expect(games[0]).toStrictEqual(firstGame)
    })
})

test('success on getting the first game from allGames with name = Catan ', () => {
  return request(app)
    .get('/borgaApi/games')
    .set('Accept', 'application/json')
    .query({ name: 'Catan' })
    .expect('Content-Type', /json/)
    .expect(200)
    .then(response => response.body)
    .then(games => {
      expect(games[0]).toStrictEqual(firstCatanGame)
    })
})

// TESTS FOR GROUPS
test('success on creating a group', () => {
  return request(app)
    .post('/borgaApi/groups')
    .set('Accept', 'application/json')
    .set('Authorization', 'Bearer 3fa85f64-5717-4562-b3fc-2c963f66afa6')
    .send({ name: 'TestGroup', description: 'Group for Tests' })
    .expect('Content-Type', /json/)
    .expect(201)
    .then(response => response.body)
    .then(group =>
      expect(group).toStrictEqual({
        id: 4,
        name: 'TestGroup',
        description: 'Group for Tests',
        games: [],
        userName: 'Gustavo'
      })
    )
})

test('failure on creating a group because no body was sent', () => {
  return request(app)
    .post('/borgaApi/groups')
    .set('Accept', 'application/json')
    .set('Authorization', 'Bearer 3fa85f64-5717-4562-b3fc-2c963f66afa6')
    .expect('Content-Type', /json/)
    .expect(400)
    .catch(error =>
      expect(error).toStrictEqual({
        code: 'e1',
        error: `name is required`
      })
    )
})

test('success on getting all groups', () => {
  return request(app)
    .get('/borgaApi/groups')
    .set('Accept', 'application/json')
    .set('Authorization', 'Bearer 3fa85f64-5717-4562-b3fc-2c963f66afa6')
    .expect('Content-Type', /json/)
    .expect(200)
    .then(response => response.body)
    .then(groups =>
      expect(groups).toStrictEqual([
        {
          id: 1,
          name: 'GroupOfGustavo',
          description: 'group1',
          games: [],
          userName: 'Gustavo'
        },
        {
          id: 4,
          name: 'TestGroup',
          description: 'Group for Tests',
          games: [],
          userName: 'Gustavo'
        }
      ])
    )
})

test('get group with id 1', () => {
  return request(app)
    .get('/borgaApi/groups/1')
    .set('Accept', 'application/json')
    .set('Authorization', 'Bearer 3fa85f64-5717-4562-b3fc-2c963f66afa6')
    .expect('Content-Type', /json/)
    .expect(200)
    .then(response => {
      expect(response.body).toStrictEqual({
        id: 1,
        name: 'GroupOfGustavo',
        description: 'group1',
        games: [],
        userName: 'Gustavo'
      })
    })
})

test('success on editing a group', () => {
  return request(app)
    .put('/borgaApi/groups/4')
    .set('Accept', 'application/json')
    .set('Authorization', 'Bearer 3fa85f64-5717-4562-b3fc-2c963f66afa6')
    .send({ name: 'EditedGroup', description: 'This group has been edited' })
    .expect('Content-Type', /json/)
    .expect(200)
    .then(response => response.body)
    .then(groups =>
      expect(groups).toStrictEqual({
        id: 4,
        name: 'EditedGroup',
        description: 'This group has been edited',
        games: [],
        userName: 'Gustavo'
      })
    )
})

test('failure on getting a group, inexistent id', () => {
  return request(app)
    .get('/borgaApi/groups/2134567')
    .set('Accept', 'application/json')
    .set('Authorization', 'Bearer 3fa85f64-5717-4562-b3fc-2c963f66afa6')
    .expect('Content-Type', /json/)
    .expect(404)
    .catch(error =>
      expect(error).toStrictEqual({ code: 'e4', error: `2134567 not found` })
    )
})

test('failure on editing an group, inexistent id', () => {
  return request(app)
    .put('/borgaApi/groups/2134567')
    .set('Accept', 'application/json')
    .set('Authorization', 'Bearer 3fa85f64-5717-4562-b3fc-2c963f66afa6')
    .expect('Content-Type', /json/)
    .expect(404)
    .catch(error =>
      expect(error).toStrictEqual({ code: 'e4', error: `2134567 not found` })
    )
})

test('success on deleting a group', () => {
  return request(app)
    .delete('/borgaApi/groups/1')
    .set('Accept', 'application/json')
    .set('Authorization', 'Bearer 3fa85f64-5717-4562-b3fc-2c963f66afa6')
    .send({ name: 'EditedGroup', description: 'This group has been edited' })
    .expect('Content-Type', /json/)
    .expect(200)
    .then(response => response.body)
    .then(deletedGroup =>
      expect(deletedGroup).toStrictEqual({
        id: 1,
        name: 'GroupOfGustavo',
        description: 'group1',
        games: [],
        userName: 'Gustavo'
      })
    )
})

test('success on adding a game into a group', () => {
  return request(app)
    .put('/borgaApi/groups/4/game/OIXt3DmJU0')
    .set('Accept', 'application/json')
    .set('Authorization', 'Bearer 3fa85f64-5717-4562-b3fc-2c963f66afa6')
    .expect('Content-Type', /json/)
    .expect(200)
    .then(response => response.body)
    .then(group =>
      expect(group).toStrictEqual({
        id: 4,
        name: 'EditedGroup',
        description: 'This group has been edited',
        games: [firstCatanGame],
        userName: 'Gustavo'
      })
    )
})

test('failure on adding a game into a group because it already exists', () => {
  return request(app)
    .put('/borgaApi/groups/4/game/OIXt3DmJU0')
    .set('Accept', 'application/json')
    .set('Authorization', 'Bearer 3fa85f64-5717-4562-b3fc-2c963f66afa6')
    .expect('Content-Type', /json/)
    .expect(400)
    .then(response => response.body)
    .catch(error =>
      expect(error).toStrictEqual({
        code: 'e1',
        error: `The game with id = OIXt3DmJU0 already exists in this group`
      })
    )
})

test('success on deleting a game from a group', () => {
  return request(app)
    .delete('/borgaApi/groups/4/game/OIXt3DmJU0')
    .set('Accept', 'application/json')
    .set('Authorization', 'Bearer 3fa85f64-5717-4562-b3fc-2c963f66afa6')
    .expect('Content-Type', /json/)
    .expect(200)
    .then(response => response.body)
    .then(group =>
      expect(group).toStrictEqual({
        id: 4,
        name: 'EditedGroup',
        description: 'This group has been edited',
        games: [],
        userName: 'Gustavo'
      })
    )
})
