const jwt = require("jsonwebtoken");
const auth = require("./auth.routes");
const users = require("./user.routes");
const contacts = require("./contact.routes");
const events = require("./event.routes");
const invitations = require("./invitation.routes")
const webhooks = require("./webhooks.routes")
const db = require("../models");
const User = db.Users;

module.exports = app => {
    app.use('/auth', auth);
    app.use('/users', users);
    app.use('/contacts', contacts); // authenticateToken,
    app.use('/events', events);
    app.use('/users', invitations);
    app.use('/webhooks', basicAuthentication,webhooks);
}

function authenticateToken(req, res, next) {
    // Gather the jwt access token from the request header
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if (token == null) return res.sendStatus(401) // if there isn't any token
  
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, user) => {
      if (err) return res.sendStatus(403)
      req.user = user
     User.findByPk(user.id).then(data => {
        if(data)
            next() // pass the execution off to whatever request the client intended
        else {
            res.sendStatus(403)
        }
      })
    })
  }
  function basicAuthentication(req, res, next) {
    var authheader = req.headers;
    authheader=authheader['authorization']
    console.log(req.headers['authorization']);
 
    if (!authheader) {
        var err = new Error('You are not authenticated!');
        res.setHeader('WWW-Authenticate', 'Basic');
        err.status = 401;
        return next(err)
    }
 
    var auth = new Buffer.from(authheader,'base64').toString().split(':');
    var user = auth[0];
    var pass = auth[1];
 console.log('user',user=='whatsapp_hayyacom','pass ',pass,'lucky@2022')
    if (user =='whatsapp_hayyacom' && pass =='lucky@2022') {
        next();
    } else {
        var err = new Error('You are not authenticated!');
        res.setHeader('WWW-Authenticate', 'Basic');
        err.status = 401;
        return next(err);
    }
 
}