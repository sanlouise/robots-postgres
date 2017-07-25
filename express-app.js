const express = require('express');
const app = express();
const mustacheExpress = require('mustache-express');
const users = require('./users');
app.use(express.static('public'));

app.engine('mustache', mustacheExpress())
app.set('views', './templates')
app.set('view engine', 'mustache')

app.get('/users.json', (request, response) => {
  const data = users;
  response.json(data);
})

app.get('/users', (request, response) => {
  response.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <link rel="stylesheet" href="public/styles.css">
      </head>
      <body>
        <p>These are all users</p>
        <p>
           <a href="/">Home</a>
         </p>
      </body>
    </html>
  `)
})

app.get('/', (request, response) => {
  const data = users;
  response.render('index', data)
})

app.get('/info/:friendName', (request, response) => {
  const data = {
    name: request.params.username,
    avatar: request.params.avatar,
    email: request.params.email,
    university: request.params.university,
    job: request.params.job,
    company: request.params.company,
    skills: request.params.skills,
    phone: request.params.phone,
  }
  response.render('info', data)
})

app.listen(3000, () => {
  console.log('Listening on port 3000')
})
