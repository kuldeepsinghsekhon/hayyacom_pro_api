
module.exports = (sequelize, Sequelize) => {
    const Invitationpage = sequelize.define("Invitationpage", {
        media: {
            allowNull: true,
            type: Sequelize.STRING
        },
        language: {
            allowNull: true,
            type: Sequelize.STRING
        },
		FooterAR: {
            allowNull: true,
            type: Sequelize.STRING
        },
		FooterEN: {
            allowNull: true,
            type: Sequelize.STRING
        },
        WhatsappnumberURL: {
            allowNull: true,
            type: Sequelize.STRING
        }	
    },{
	  timestamps: false,
	  freezeTableName: true
  });
  Invitationpage.associate = function (models) {
    Invitationpage.belongsTo(models.Design, {foreignKey: "DesignId" });
};
    return Invitationpage;
  };