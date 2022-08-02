
const auth = require("../controllers/auth.controller.js");

var router = require("express").Router();

router.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// Create a new user
router.post("/login", auth.login);
module.exports = router; 