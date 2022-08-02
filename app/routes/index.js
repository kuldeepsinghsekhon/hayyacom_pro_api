const jwt = require("jsonwebtoken");
const auth = require("./auth.routes");
const users = require("./user.routes");
const contacts = require("./contact.routes");
const events = require("./event.routes");
const invitations = require("./invitation.routes")
const db = require("../models");
const User = db.Users;

module.exports = app => {
    app.use('/auth', auth);
    app.use('/users', users);
    app.use('/contacts', contacts); // authenticateToken,
    app.use('/events', events);
    app.use('/users', invitations);
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