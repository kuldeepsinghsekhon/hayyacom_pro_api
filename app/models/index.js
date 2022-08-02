const dbConfig = require("../config/db.config.js");
const fs = require('fs');
const path = require('path')
const basename = path.basename(__filename);
const dotenv = require('dotenv');
const db = {};
dotenv.config();
const Sequelize = require('sequelize');
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  operatorsAliases: false,

  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle
  }
});
fs.readdirSync(__dirname)
  .filter((file) => {
    return (
      file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js'
    );
  })
  .forEach((file) => {
    const model = require(path.join(__dirname, file))(
      sequelize,
      Sequelize.DataTypes
    );
    console.log(model.name)
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

// db.Users = require("./user.model.js")(sequelize, Sequelize);
// db.Contacts = require("./contact.model.js")(sequelize, Sequelize);
// db.Events = require("./event.model.js")(sequelize, Sequelize);
// db.Invitations = require("./invitation.model")(sequelize, Sequelize);


//db.Users.hasMany(db.Events, { as: "events", foreignKey: "eventId"});
/*  db.Events.belongsTo(db.Users, {
    foreignKey: "userId",
    as: "user",
}); */

db.Sequelize = Sequelize;
db.sequelize = sequelize;

module.exports = db;