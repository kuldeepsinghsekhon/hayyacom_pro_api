
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
        packagetype: {
            allowNull: true,
            type: Sequelize.STRING
        },
        paperAttendence: {
            allowNull: true,
            type: Sequelize.INTEGER
        },
        totalguest: {
            allowNull: true,
            type: Sequelize.INTEGER
        },
        eventDate: {
            allowNull: true,
            type: Sequelize.STRING
        },
        eventtitle: {
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
        WEvent.belongsToMany(models.User, { as: 'users', through: "User_WEvent" });
    };
    return WEvent;
};