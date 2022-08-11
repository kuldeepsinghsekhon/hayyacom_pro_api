
module.exports = (sequelize, Sequelize) => {
    const Design = sequelize.define("Design", {
        QRcolor: {
            allowNull: true,
            type: Sequelize.STRING
        },
        QRsize: {
            allowNull: true,
            type: Sequelize.INTEGER
        },
		bgcolorQR: {
            allowNull: true,
            type: Sequelize.STRING
        },
		infocolor: {
            allowNull: true,
            type: Sequelize.STRING
        },
        textcolor: {
            allowNull: true,
            type: Sequelize.STRING
        },	
        fontUrl: {
            allowNull: true,
            type: Sequelize.STRING
        },
        fontsize:{
			allowNull: true,
            type: Sequelize.STRING,
			defaultValue:'1rem'
		},	
		fontfamily:{
			allowNull: true,
            type: Sequelize.STRING
		},
		fontweight:{
			allowNull: true,
            type: Sequelize.STRING,
			defaultValue:'500'
		},
		
    },{
	  timestamps: false,
	  freezeTableName: true
  });
  Design.associate = function (models) {
    Design.belongsTo(models.User, {foreignKey: "UserId" });
    Design.belongsTo(models.WEvent, {foreignKey: "EventId",as:'event' });
};
    return Design;
  };