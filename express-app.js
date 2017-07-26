const express = require('express');
const app = express();
const mustacheExpress = require('mustache-express');
const users = require('./users');
app.use(express.static('public'));

app.engine('mustache', mustacheExpress())
app.set('views', './templates')
app.set('view engine', 'mustache')

app.listen(3000, () => {
  console.log('Listening on port 3000')
})

app.get('/', (request, response) => {
  response.render('index', { users });
})

app.get('/info/:username', (request, response) => {
  const username = request.params.username;
  console.log({username});
  let user;
  for (let i = 0; i < users.length; i++) {
    if (users[i].username === username) {
      user = users[i];
      console.log({user});
      break;
    }
  }

  if (!user) {
    return response.status(404).send({ message: `Unable to find user ${username}.` });
  }
  return response.render('info', user);
})
