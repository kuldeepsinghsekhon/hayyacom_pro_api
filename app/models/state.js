module.exports = (sequelize, Sequelize) => {
    const State = sequelize.define("State", {
        name: {
            allowNull: false,
            type: Sequelize.STRING
        },
        fips_code: {
            allowNull: false,
            type: Sequelize.STRING
        },
        iso2: {
            allowNull: false,
            type: Sequelize.STRING
        },
        flag: {
            allowNull: false,
            type: Sequelize.INTEGER
        },
        type: {
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
        wikiDataId: {
            allowNull: false,
            type: Sequelize.FLOAT
        }
    }, {
        timestamps: true,
        tableName: "states"
    });
    State.associate = function (models) {
        State.belongsTo(models.Country,{ foreignKey: "country_id"});
    };
    return State;
};