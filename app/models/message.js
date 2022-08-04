
module.exports = (sequelize, Sequelize) => {
    const Message = sequelize.define("Message", {
        save_qr_message: {
            allowNull: true,
            type: Sequelize.STRING
        },
        message_title: {
            allowNull: true,
            type: Sequelize.STRING
        },
        remider: {
            allowNull: true,
            type: Sequelize.STRING
        },
        RSVP: {
            allowNull: true,
            type: Sequelize.STRING
        },
        Guest_name_title: {
            allowNull: true,
            type: Sequelize.STRING
        },
        note_message: {
            allowNull: true,
            type: Sequelize.STRING
        }
    }, {
        timestamps: false,
        freezeTableName: true
    });
    Message.associate = function (models) {
        Message.belongsTo(models.Design, {foreignKey: "DesignId" });
    };
    return Message;
};