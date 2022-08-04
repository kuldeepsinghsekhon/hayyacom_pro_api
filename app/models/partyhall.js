module.exports = (sequelize, Sequelize) => {
    const Partyhall = sequelize.define("Partyhall", {
        name: {
            allowNull: true,
            type: Sequelize.STRING
        },
        city: {
            allowNull: true,
            type: Sequelize.STRING
        },
        country: {
            allowNull: true,
            type: Sequelize.STRING
        },
		locationURL: {
            allowNull: true,
            type: Sequelize.STRING
        }
    }, {
        timestamps: false,
    });
    Partyhall.associate = function (models) {
        Partyhall.belongsTo(models.WEvent, {foreignKey: "EventId" });
    };
    return Partyhall;
};