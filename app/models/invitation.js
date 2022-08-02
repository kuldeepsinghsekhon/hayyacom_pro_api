module.exports = (sequelize, Sequelize) => {
    const Invitation = sequelize.define("Invitation", {
		id: {
			type: Sequelize.STRING,
			primaryKey: true
		  },
		/*eventSchedule :{
			type: Sequelize.STRING,
            allowNull: true,
		},*/
        status: {
            type: Sequelize.STRING
        },
		attended: {
            type: Sequelize.INTEGER,
			defaultValue:0
        }
    }
	,{
	  timestamps: false,
  });
    return Invitation;
  };