const app = require('express').Router();
const models = require('./db').models;
const jwt = require('jwt-simple');


module.exports = app;


app.get('/products', (req, res, next)=> {
  models.Product.findAll({ order: 'name'})
    .then( products => res.send(products ))
    .catch(next);
});

app.delete('/products/:id', (req, res, next)=> {
  models.Product.destroy({ where: { id: req.params.id}})
    .then( () => res.sendStatus(204))
    .catch(next);
});

const JWT_SECRET = process.env.JWT_SECRET;

if(!JWT_SECRET)
  throw 'define JWT secret';

app.get('/session/:token', (req, res, next)=> {
  try{
    const token = jwt.decode(req.params.token, JWT_SECRET);
    models.User.findById(token.id)
      .then( user => res.send(user))
      .catch(next);
  }
  catch(er){
    res.sendStatus(401);
  }
});

app.post('/session', (req, res, next)=> {
  const credentials = { name, password } = req.body;
  if(!credentials.name || !credentials.password){
    return res.sendStatus(401);
  }
  models.User.findOne({ where: credentials })
    .then( user => {
      if(!user){
        res.sendStatus(401);
      }
      else{
        const token = jwt.encode({ id: user.id}, JWT_SECRET);
        console.log(user.get());
        res.status(200).send({ token });
      }
    })
    .catch(next);
});

app.get('/categories', (req, res, next)=> {
  models.Category.findAll({ order: 'name', include: [ models.Product ]})
    .then( categories => res.send(categories ))
    .catch(next);
});
