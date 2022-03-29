const fetch = require('node-fetch')
const AC_ID = process.env.ATLAS_CLIENT_ID

module.exports = {
  fetchGames: fetchGames,
  getGameById: getGameById
}

function fetchGames(name) {
  if (!name)
    var fetchUrl = `https://api.boardgameatlas.com/api/search?limit=10&client_id=${AC_ID}`
  else
    fetchUrl = `https://api.boardgameatlas.com/api/search?name=${name}&limit=10&client_id=${AC_ID}`

  return Promise.all([
    fetch(
      `https://api.boardgameatlas.com/api/game/categories?&pretty=true&client_id=${AC_ID}`
    ),
    fetch(
      `https://api.boardgameatlas.com/api/game/mechanics?&pretty=true&client_id=${AC_ID}`
    )
  ])
    .then(responses => Promise.all(responses.map(response => response.json())))
    .then(d => {
      var data = []
      data.push(d[0].categories)
      data.push(d[1].mechanics)
      return data
    })
    .then(data =>
      fetch(fetchUrl)
        .then(response => response.json())
        .then(obj => obj.games)
        .then(game =>
          game.map(info => {
            const info_result = {
              id: info.id,
              name: info.name,
              url: info.url,
              description: info.description,
              image: info.image_url,

              mechanics: data[1]
                .map(mechanic => {
                  var m = info.mechanics
                    .map(mec => {
                      if (mec.id == mechanic.id) return { name: mechanic.name }
                    })
                    .filter(element => element !== undefined)

                  if (m.length > 0) {
                    return m[0]
                  }
                })
                .filter(element => element !== undefined),

              categories: data[0]
                .map(category => {
                  var c = info.categories
                    .map(cat => {
                      if (cat.id == category.id) {
                        return { name: category.name }
                      }
                    })
                    .filter(element => element !== undefined)

                  if (c.length > 0) {
                    return c[0]
                  }
                })
                .filter(element => element !== undefined)
            }
            return info_result
          })
        )
    )
}

function getGameById(gameId) {
  var fetchUrl = `https://api.boardgameatlas.com/api/search?ids=${gameId}&client_id=${AC_ID}`

  return Promise.all([
    fetch(
      `https://api.boardgameatlas.com/api/game/categories?&pretty=true&client_id=${AC_ID}`
    ),
    fetch(
      `https://api.boardgameatlas.com/api/game/mechanics?&pretty=true&client_id=${AC_ID}`
    )
  ])
    .then(responses => Promise.all(responses.map(response => response.json())))
    .then(d => {
      var data = []
      data.push(d[0].categories)
      data.push(d[1].mechanics)
      return data
    })
    .then(data =>
      fetch(fetchUrl)
        .then(response => response.json())
        .then(obj => obj.games)
        .then(game =>
          game.map(info => {
            const info_result = {
              id: info.id,
              name: info.name,
              url: info.url,
              description: info.description,
              image: info.image_url,

              mechanics: data[1]
                .map(mechanic => {
                  var m = info.mechanics
                    .map(mec => {
                      if (mec.id == mechanic.id) return { name: mechanic.name }
                    })
                    .filter(element => element !== undefined)

                  if (m.length > 0) {
                    return m[0]
                  }
                })
                .filter(element => element !== undefined),

              categories: data[0]
                .map(category => {
                  var c = info.categories
                    .map(cat => {
                      if (cat.id == category.id) {
                        return { name: category.name }
                      }
                    })
                    .filter(element => element !== undefined)

                  if (c.length > 0) {
                    return c[0]
                  }
                })
                .filter(element => element !== undefined)
            }
            return info_result
          })
        )
    )
}
