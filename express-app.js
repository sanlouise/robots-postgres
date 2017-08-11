const express = require('express');
const pgPromise = require('pg-promise')();
const mustacheExpress = require('mustache-express');
const pg = require('pg');
const robotDB = pgPromise({ database: 'robots' })
const bodyParser = require('body-parser');

const app = express();
app.use(express.static('public'));

app.engine('mustache', mustacheExpress())
app.set('views', './templates')
app.set('view engine', 'mustache')

app.use(bodyParser.urlencoded({ extended: false }))

app.listen(3000, () => {
  console.log('Listening on port 3000')
})

app.get('/', (request, response) => {
  robotDB.any(`SELECT * from robots`)
  .then(robots => {
    response.render('index', { robots })
  })
})

app.get('/search', (request, response) => {
  const name = request.query.name

  robotDB.any('SELECT * FROM "robots" where "name" LIKE $(pattern)',
    { pattern: `%${name}%` })
  .then((robots) => {
    response.render('search', { robots: robots })
  })
  .catch((error) => {
    console.log('error', error)
    response.render('error')
  })
})

app.get('/new', (request, response) => {
  response.render('new');
})

app.post('/create', (request, response) => {
  const newRobotData = request.body;

  const { address } = newRobotData;
  // Set default values of address details to ''.
  let street_num, street_name, city, state_or_province, postal_code, country = '';
  // Does the robot have an address?
  if (address) {
    // Make sure none of the address details have null or undefined values
    street_num = address.street_num || '';
    street_name = address.street_name || '';
    city = address.city || '';
    state_or_province = address.state_or_province || '';
    postal_code = address.postal_code || '';
    country = address.country || '';
  }

  const newRobot = {
    username: newRobotData.username,
    name: newRobotData.name,
    avatar: newRobotData.avatar,
    email: newRobotData.email,
    university: newRobotData.university,
    job: newRobotData.job,
    company: newRobotData.company,
    phone: newRobotData.phone,
    street_num,
    street_name,
    city,
    state_or_province,
    postal_code,
    country,
  }

  console.log('newRobot', newRobot);

  robotDB.one(`INSERT INTO robots (username, name, avatar, email, university, job, company, phone, street_num, street_name, city, state_or_province, postal_code, country) VALUES($(username) $(name), $(avatar), $(email), $(university), $(job), $(company), $(phone), $(street_num) $(street_name), $(city), $(state_or_province), $(postal_code), $(country)) RETURNING id`, newRobot)

  response.redirect('/');
})

app.get('/robot/:id', (request, response) => {
  const id = request.params.id;
  robotDB.one(`SELECT * FROM robots WHERE id = $(id)`, {id: id})
  .then(robot => {
    console.log(robot)
    response.render("robot", robot)
  })
  .catch(error => {
    const displayError = "Oops, something went wrong!"
    response.render("error", { displayError })
  })
})

// app.delete('/robot/:id', (req, res) => {
//   const id = parseInt(req.params.id);
//   robotDB.one(`DELETE FROM robots WHERE id = $(id)`, {id: id})
//   .then() => {
//     response.redirect("/");
//   })
//   .catch(error => {
//     const displayError = "Oops, we couldn't delete that user!"
//     response.render("error", { displayError })
//   })
// })
