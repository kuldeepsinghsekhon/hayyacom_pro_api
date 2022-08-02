const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
require('dotenv').config();
const db = require("./app/models");
var path = require('path');
db.sequelize.sync().catch(err=>console.log(err));

const app = express();
app.use(cors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
}));

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/static', express.static(path.join(__dirname, './build/static')))
// simple route

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname + '/build/index.html'));
});

require("./app/routes")(app);

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname + '/build/index.html'));
}); 
// set port, listen for requests
const PORT = process.env.PORT || 3005;
app.listen(PORT, () => {
  console.log(`Hayyacom pro is running on port ${PORT}.`);
});