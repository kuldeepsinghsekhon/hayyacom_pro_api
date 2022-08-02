module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define("User", {
    name: {
      allowNull: false,
      type: Sequelize.STRING
    },
    phoneNumber: {
      allowNull: false,
      type: Sequelize.STRING
    },
    password: {
      allowNull: false,
      type: Sequelize.STRING
    },
    language: {
      allowNull: false,
      type: Sequelize.STRING,
      defaultValue: 'en_US'
    },
  
  }, {
    timestamps: false,
  });
  User.associate = function (models) {
    User.belongsToMany(models.WEvent, {as: 'events',through:"User_WEvent"});//
};
  return User;
};