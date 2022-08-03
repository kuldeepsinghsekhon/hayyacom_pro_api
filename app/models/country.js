module.exports = (sequelize, Sequelize) => {
    const Country = sequelize.define("Country", {
        name: {
            allowNull: false,
            type: Sequelize.STRING
        },
        numeric_code:{
            allowNull: false,
            type: Sequelize.STRING
        },
        iso3: {
            allowNull: false,
            type: Sequelize.STRING
        },
        iso2: {
            allowNull: false,
            type: Sequelize.STRING
        },
        phonecode: {
            allowNull: false,
            type: Sequelize.STRING
        },
        capital: {
            allowNull: false,
            type: Sequelize.STRING
        },
        currency: {
            allowNull: false,
            type: Sequelize.STRING
        },
        currency_name: {
            allowNull: false,
            type: Sequelize.STRING
        },
        currency_symbol: {
            allowNull: false,
            type: Sequelize.STRING
        },
        tld: {
            allowNull: false,
            type: Sequelize.STRING
        },
        native: {
            allowNull: false,
            type: Sequelize.STRING
        },
        region: {
            allowNull: false,
            type: Sequelize.STRING
        },
        subregion: {
            allowNull: false,
            type: Sequelize.STRING
        },
        timezones: {
            allowNull: false,
            type: Sequelize.STRING
        },
        translations: {
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
        emoji: {
            allowNull: false,
            type: Sequelize.STRING
        },
        emojiU: {
            allowNull: false,
            type: Sequelize.STRING
        },
        flag: {
            allowNull: false,
            type: Sequelize.INTEGER
        },
        wikiDataId: {
            allowNull: false,
            type: Sequelize.INTEGER
        },
        emojiU: {
            allowNull: false,
            type: Sequelize.STRING
        }
    }, {
        timestamps: true,
        tableName: "countries"
    });
   
    return Country;
};