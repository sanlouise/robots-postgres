const express = require('express');
const pgPromise = require('pg-promise')();
const mustacheExpress = require('mustache-express');
const pg = require('pg');
const robotDB = pgPromise({ database: 'robots' })

const app = express();
app.use(express.static('public'));

app.engine('mustache', mustacheExpress())
app.set('views', './templates')
app.set('view engine', 'mustache')

app.listen(3000, () => {
  console.log('Listening on port 3000')
})

app.get('/', (request, response) => {
  robotDB.any(`SELECT * from robots`)
  .then(robots => {
    response.render('index', { robots })
  })
})

app.get('/create', (request, response) => {
  response.render('create')
})

app.get('/robot/:username', (request, response) => {
  const username = request.params.username;
  robotDB.task('get-robot-info', task => {
       return task.batch([
          task.one('SELECT * FROM robots WHERE id = $(id)', { id: id }),
       ])
     })
     .then(data => {
         const robot = data
         response.render("robot", {robot})
     })
       .catch(error => {
         const displayError = "Oops, we can't seem to find that robot!"
         response.render("robot", { displayError })
     })
})
