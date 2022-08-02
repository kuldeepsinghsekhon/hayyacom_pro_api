module.exports = (sequelize, Sequelize) => {
    const Contact = sequelize.define("Contact", {
        name: {
            allowNull: false,
            type: Sequelize.STRING
        },
        phoneNumber: {
            allowNull: false,
            type: Sequelize.STRING
        },
        totalGuest: {
            allowNull: false,
            type: Sequelize.INTEGER
        },
        totalChildren: {
            allowNull: false,
            type: Sequelize.INTEGER
        }
    }, {
        timestamps: false,
    });
    Contact.associate = function (models) {
        Contact.belongsTo(models.User);
        Contact.belongsTo(models.WEvent);
    };
    return Contact;
};