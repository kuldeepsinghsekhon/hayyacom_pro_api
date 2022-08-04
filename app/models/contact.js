module.exports = (sequelize, Sequelize) => {
    const Contact = sequelize.define("Contact", {
        name: {
            allowNull: false,
            type: Sequelize.STRING
        },
        phoneNumber: {
            allowNull: false,
            type: Sequelize.STRING
        }
    }, {
        timestamps: false,
    });
    Contact.associate = function (models) {
        Contact.belongsTo(models.User, {foreignKey: "UserId" });
        Contact.belongsTo(models.WEvent, {foreignKey: "EventId" });
        //Contact.hasOne(models.Invitation, {foreignKey: "InvitationId" });
    };
    return Contact;
};