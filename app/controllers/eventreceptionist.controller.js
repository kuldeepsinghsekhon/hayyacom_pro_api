const db = require("../models");
const Receptionistevent = db.Receptionistevent;
const Op = db.Sequelize.Op;

// Assign Receptionist to event Save a new Receptionist
exports.create = (req, res) => {
    // Validate request
    if (!req.body) {
        res.status(400).send({
        message: "Receptionist can not be empty!"
        });
        return;
    }
    let ReceptionistData = req.body
    Receptionistevent.findOne({where : {ReceptionistMobileNo: ReceptionistData.ReceptionistMobileNo,date:ReceptionistData.date} }).then(data => {
      if(data) {
		 Receptionistevent.destroy({where : {ReceptionistMobileNo: ReceptionistData.ReceptionistMobileNo,date:ReceptionistData.date} })
          .then(data => {
            res.status(200).send({
              message: "UnAssigned Successfully."
            });
          })
		  /*
        res.status(401).send({
          message: "Receptionist already booked for an event"
        });*/
      } else {
         Receptionistevent.create(ReceptionistData)
          .then(data => {
            res.send(data);
          })
          .catch(err => {
            res.status(500).send({
              message:
                err.message || "Some error occurred while creating the Receptionist."
            });
          });
      }
    }).catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Receptionist."
      });
    })
};

 exports.eventreceptionists= (req, res) => {
	//res.send({"receptionist":"receptionist"});
	let eventData = req.body
	console.log(eventData)
        Receptionist.findAll({where :{"eventID":eventData.eventID}}).then(receptionist => {
        if(!receptionist) {
          res.status(401).send({
            message: "Receptionist doesn't exist"
          });
        } else {
            res.send({data: receptionist});
        }
      }).catch(err => {
		  console.log(err);
        res.status(500).send({
          message:
            err || "Some error occurred while creating the Receptionist."
        });
      })  
} 
