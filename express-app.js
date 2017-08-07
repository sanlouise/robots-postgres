const express = require('express');
const pgPromise = require('pg-promise')();
const mustacheExpress = require('mustache-express');
const robots = require('./robots');
const pg = require('pg');
const robotDB = pgPromise({ database: 'robots' })

// CREATE TABLE robots (
// id serial PRIMARY KEY,
// username varchar(20) NOT NULL,
// name varchar(40),
// avatar varchar(150),
// email varchar(50),
// university varchar(80),
// job varchar(100),
// company varchar(80),
// phone varchar(20),
// street_num varchar(8),
// street_name varchar(50),
// city varchar(40),
// state_or_province varchar(40),
// postal_code varchar(10),
// country varchar(40));

const app = express();
app.use(express.static('public'));

app.engine('mustache', mustacheExpress())
app.set('views', './templates')
app.set('view engine', 'mustache')

app.listen(3000, () => {
  console.log('Listening on port 3000')
})

robotDB.any(`SELECT * from robots`).then(robots => {
    response.render('index', { robots })
  })
})

app.get('/', (request, response) => {
  response.render('index', { robots });
})

app.get('/create', (request, response) => {
  response.render('create')
})

app.get('/info/:username', (request, response) => {
  const username = request.params.username;
  console.log({username});
  let user;
  for (let i = 0; i < robots.length; i++) {
    if (robots[i].username === username) {
      user = robots[i];
      console.log({user});
      break;
    }
  }

  if (!user) {
    return response.status(404).send({ message: `Unable to find user ${username}.` });
  }
  return response.render('info', user);
})
