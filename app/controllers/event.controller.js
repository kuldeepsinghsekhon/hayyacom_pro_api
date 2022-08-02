const db = require("../models");
const Event = db.Events;
const User = db.Users;
const User_Event = db.User_Event;
const Eventseq = db.Eventsseq;
const PartyHall = db.PartyHall;
const Op = db.Sequelize.Op;
const moment = require("moment");
// Create and Save a new Event
exports.create = async (req, res) => {
    // Validate request
    if (!req.body) {
        res.status(400).send({
        message: "Content can not be empty!"
        });
        return;
    }
    let eventData = req.body
   // Event.findOne({where : {userId: req.user.id}}).then(event => {
      // if(event) {
      //   res.status(401).send({
      //     message: "One Event already exists"
      //   });
      // } else {
        eventData.userId = req.user.id
		const EventseqData=await Eventseq.create();
			eventData.id='W'+EventseqData.id;
			const data=await Event.create(eventData);
      await User_Event.create({"UserId":req.user.id,"WEventId":eventData.id})
           res.send({data});
 		// 	  .catch(err => {
				  
		// 		res.status(500).send({
		// 		  message:
		// 			err || "Some error occurred while creating the Event."
		// 		});
		// 	  });
		// });
      }


// Retrieve all Events from the database.
exports.findAll = async (req, res) => {
  try {
    let current_date=moment().format('MM/DD/YYYY');
    let fromDate=moment().subtract(30, 'days').format('MM/DD/YYYY');
    let upcomingDate=moment().add(30, 'days').format('MM/DD/YYYY');
    console.log('current_date',current_date)
let event= await Event.findAll({include: [{ model: db.Users,    as: 'users'	},{ model: PartyHall, as: 'partyhall', required: false  }]})
 let lastmonths =await Event.findAll({where : {"eventDate" : {[Op.between] : [fromDate , current_date ]}},include: [{    model: db.Users,    as: 'users'	},{ model: PartyHall, as: 'partyhall', required: false  }]})
let upcoming= await Event.findAll({where : {"eventDate" : {[Op.between] :  [current_date , upcomingDate ]}},include: [{    model: db.Users,    as: 'users'	},{ model: PartyHall, as: 'partyhall', required: false  }]})
res.send({data: event,lastmonths:lastmonths,upcoming:upcoming});
} catch (err) {
  res.status(500).send({
    message:
      err || "Some error occurred while creating the Event."
  });
}

};

// Find a single Event with an id
exports.findOne = async (req, res) => {
  let event= await Event.findOne({where:{id:req.params.id},include:{
    model: db.User,
    as: 'user'
  } }).catch(err=>{
    res.status(500).send({
      message:
        err || "Some error occurred while getting the Event."
    });
  })
  res.status(200).send(event);
};

// Update a Event by the id in the request
exports.update = async(req, res) => {
    // Validate request
    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
        return;
    }
    let eventData = req.body
    let user_event=eventData.User_Event;
    const id = req.params.id;
   let updated_ue =await User_Event.update({title:eventData.title,message:eventData.message,description:eventData.description,reminderMessage:eventData.reminderMessage,invitationLink:eventData.invitationLink},{where:{WEventId:user_event.WEventId,UserId:user_event.UserId}})
   Event.update(eventData, {
        where: { id: id }
      })
        .then(num => {
          if (num == 1) {
            res.send({
              message: "Event was updated successfully."
            });
          } else {
            res.send({
              message: `Cannot update Event with id=${id}. Maybe Event was not found or req.body is empty!`
            });
          }
        })
        .catch(err => {
          res.status(500).send({
            message: "Error updating Event with id=" + id
          });
        });
};

// Delete a Event with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;

    Event.destroy({
      where: { id: id }
    })
      .then(num => {
        if (num == 1) {
          res.send({
            message: "Contact was deleted successfully!"
          });
        } else {
          res.send({
            message: `Cannot delete Contact with id=${id}. Maybe Contact was not found!`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Could not delete Contact with id=" + id
        });
      });
};

// Delete all Events from the database.
exports.deleteAll = (req, res) => {
  
};