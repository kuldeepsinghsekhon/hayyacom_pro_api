
module.exports = (sequelize, Sequelize) => {
    const WEvent = sequelize.define("WEvent", {
        
        locationurl: {
            allowNull: false,
            type: Sequelize.STRING
        },
        type: {
            allowNull: true,
            type: Sequelize.STRING
        },
        eventDate: {
            allowNull: true,
            type: Sequelize.STRING
        },
        notes: {
            allowNull: true,
            type: Sequelize.STRING
        }
    }, {
        timestamps: false,
        freezeTableName: true
    });
    WEvent.associate = function (models) {
        WEvent.belongsToMany(models.User, {as: 'users', through: "User_WEvent" });
    };
    return WEvent;
};