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

app.get('/info/:username', (request, response) => {
  const username = request.params.username;
  let user;
  for (let i = 0; i < users.length; i++) {
    if (users[i].username === username) {
      user = users[i];
      break;
    }
  }

  if (!user) {
    return response.status(404).send({ message: `Unable to find user ${username}.` });
  }
  return response.render('info', user);
})

app.listen(3000, () => {
  console.log('Listening on port 3000')
})
