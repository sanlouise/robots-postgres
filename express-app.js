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
        <link rel="stylesheet" href="style.css">
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

app.listen(3000, () => {
  console.log('Listening on port 3000')
})
