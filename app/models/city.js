module.exports = (sequelize, Sequelize) => {
    const City = sequelize.define("City", {
        name: {
            allowNull: false,
            type: Sequelize.STRING
        },
        state_code: {
            allowNull: false,
            type: Sequelize.STRING
        },
        country_code: {
            allowNull: false,
            type: Sequelize.STRING
        },
        latitude: {
            allowNull: false,
            type: Sequelize.FLOAT
        },
        longitude: {
            allowNull: false,
            type: Sequelize.FLOAT
        },
        flag: {
            allowNull: false,
            type: Sequelize.STRING
        },
        wikiDataId: {
            allowNull: false,
            type: Sequelize.FLOAT
        }
    }, {
        timestamps: true,
        tableName: "cities"
    });
    City.associate = function (models) {
        City.belongsTo(models.Country,{ foreignKey: "country_id"});
        City.belongsTo(models.State,{ foreignKey: "state_id"});
    };
    return City;
};