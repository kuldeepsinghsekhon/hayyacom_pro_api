module.exports = (sequelize, Sequelize) => {
  const Invitation = sequelize.define("Invitation", {
    total_guest: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    confirmed: {
      type: Sequelize.INTEGER,
      allowNull: true,
    },
    attended: {
      type: Sequelize.INTEGER,
      allowNull: true,
    },
    total_children: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    childrenattended: {
      type: Sequelize.INTEGER,
      allowNull: true,
    },
    checkintime: {
      type: Sequelize.STRING,
      allowNull: true,
    }
  }
    , {
      timestamps: false,
    });
  Invitation.associate = function (models) {
    Invitation.belongsTo(models.User, {foreignKey: "UserId" });
    Invitation.belongsTo(models.WEvent, {foreignKey: "EventId" });
    Invitation.belongsTo(models.Contact, {foreignKey: "ContactId" });
    Invitation.belongsTo(models.Design, {foreignKey: "DesignId" });
  };
  return Invitation;
};