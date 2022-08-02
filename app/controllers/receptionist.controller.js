const db = require("../models");
const Receptionist = db.Receptionist;
const Receptionistevent = db.Receptionistevent;
const Op = db.Sequelize.Op;

// Create and Save a new Receptionist
exports.create = (req, res) => {
    // Validate request
    if (!req.body) {
        res.status(400).send({
        message: "Receptionist can not be empty!"
        });
        return;
    }
    let ReceptionistData = req.body
    Receptionist.findOne({where : {MobileNo: ReceptionistData.MobileNo} }).then(data => {
      if(data) {
        res.status(401).send({
          message: "Mobile No already exists"
        });
      } else {
         Receptionist.create(ReceptionistData)
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

// Retrieve all Receptionists from the database.
exports.findAll = (req, res) => {
	//res.send({"receptionist":"receptionist"});
       Receptionist.findAll().then(receptionist => {
        if(!receptionist) {
          res.status(401).send({
            message: "Receptionist doesn't exist"
          });
        } else {
            res.send({data: receptionist});
        }
      }).catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while creating the Receptionist."
        });
      }) 
};
exports.eventcity=async (req, res) => {
	//res.send({"receptionist":"receptionist"});
	let eventData = req.body
	console.log(eventData)
       receptionists= await Receptionist.findAll({where :{"city":eventData.city}, raw: true,})
        if(!receptionists) {
          res.status(401).send({
            message: "Receptionist doesn't exist"
          });
        } else {
			let bookedReceptionists=await Receptionistevent.findAll({where : {date:eventData.date},raw: true })
			//console.log(bookedReceptionists)
			  receptionists.forEach(receptionist=>{
				  receptionist.booked=false;
				  bookedReceptionists.forEach(bReception=>{
					  
					 
					  if(bReception.ReceptionistMobileNo==receptionist.MobileNo){
						  receptionist.booked=true; 
							receptionist.booking=bReception;
					  }
					   console.log(receptionist.booked)
				  });
				  
			  })
			// send city receptionist
           res.send({data: receptionists});
        }
     
}
 function receptionistBooked(row,date){
	//let booking=await Receptionistevent.findOne({where : {ReceptionistMobileNo: row.MobileNo,date:date},raw: true })
	Receptionistevent.findOne({where : {ReceptionistMobileNo: row.MobileNo,date:date},raw: true }).then(receptionist => {
        if(!receptionist) {
			console.log(receptionist)
          return false;
		   const booking=false;
        } else {
			console.log(receptionist)
          const booking=true;

        }
      }).catch(err => {
        console.log('errrorrrrrrrr')
      }) 
	 return booking;
}

// Find a single Receptionist with an id
exports.findOne = (req, res) => {
  
};

// Update a Receptionist by the id in the request
exports.update = (req, res) => {
    // Validate request
    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
        return;
    }
    let ReceptionistData = req.body
    const id = req.params.id;
    Receptionist.update(ReceptionistData, {
        where: { id: id }
      })
        .then(num => {
          if (num == 1) {
            res.send({
              message: "Receptionist was updated successfully."
            });
          } else {
            res.send({
              message: `Cannot update Receptionist with id=${id}. Maybe Receptionist was not found or req.body is empty!`
            });
          }
        })
        .catch(err => {
          res.status(500).send({
            message: "Error updating Receptionist with id=" + id
          });
        });
};

// Delete a Receptionist with the specified id in the request
exports.delete = (req, res) => {
  
};

// Delete all Receptionists from the database.
exports.deleteAll = (req, res) => {
  
};

