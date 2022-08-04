const db = require("../models");
const Contact = db.Contact;
const Invitation = db.Invitation;
const Events = db.Events;
const UserEvent = db.User_Event;
const Op = db.Sequelize.Op;
const { QueryTypes } = require('sequelize');

// Create and Save a new contact
exports.createBulk =async (req, res) => {
    // Validate request
    if (!req.body) {
        res.status(400).send({
        message: "Content can not be empty!"
        });
        return;
    }
    let contactData = req.body
    let allcontacts=await Contact.findAll({where:{UserId: contactData.UserId, EventId:contactData.EventId},raw:true})
    let contacts = []
    
    if(allcontacts.length>0){
    
      contactData?.contacts.forEach(contact => {
      let ncontact = allcontacts.find(x => x.phoneNumber === contact.phoneNumber); 
      if (!ncontact){
        contact.UserId=contactData.UserId;
        contact.EventId=contactData.EventId;
        contacts.push(contact)
        console.log('ncontactncontactncontact',contact)
      }
      
    })
  }else{
    contactData?.contacts.forEach(contact => {
      contact.UserId=contactData.UserId;
      contact.EventId=contactData.EventId;
    })
    contacts=contactData?.contacts;
  }
 // console.log('allcontactsallcontactsallcontacts',contacts)
    Contact.bulkCreate(contacts)
    .then(data => {
      res.send({data});
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the contact."
      });
    });
};

// Create and Save a new contact
exports.create = async (req, res) => {

    if (!req.body) {
        res.status(400).send({
        message: "Content can not be empty!"
        });
        return;
    }
    let contactData = req.body
    let UserId=contactData.UserId
    let EventId= contactData.EventId
    let phoneNumber=contactData.phoneNumber
    console.log({UserId:UserId, WEventId:EventId,phoneNumber:phoneNumber})
	let contact= await Contact.findOne({where : {UserId:UserId, EventId:EventId,phoneNumber:phoneNumber} })
  if(contact!=null){
	res.status(409).send({
        message:
           "This contact already exists"
      })	
	}else{
    Contact.create(contactData)
    .then(data => {
      res.send({data});
    })
    .catch(err => {
      res.status(501).send({
        message:
          err.message || "Some error occurred while creating the contact."
      });
    });
  }
	
};

// Retrieve all contacts from the database.
exports.findAll = async (req, res) => {
    const userId = req.params.id
    const EventId = req.params.EventId
  let contacts= await Contact.findAll({
      where : {userId : userId,EventId:EventId},
     // include: {model:Invitation}
  }).catch(err => {
    res.status(500).send({
      message:
        err.message || "Some error occurred while creating the contact."
    });
  }); 
  //console.log(contacts[0].Invitations)
  return res.send({data: contacts});
}
//   let uninvited= await contact.findAll({
//     where : {userId : userId},
//  include: {model:Invitation}
// }).catch(err => {
//   res.status(500).send({
//     message:
//       err.message || "Some error occurred while creating the contact."
//   });
// }); 
//console.log(uninvited)
//   .then((contacts) => {
//     res.send({data: contacts});
// })

	
    /* return contact.findAll({
        where : {userId : userId}
    }).then((contacts) => {
        res.send({data: contacts});
    }).catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the contact."
      });
    }); */
//};

// Find a single contact with an id
exports.findOne = (req, res) => {
    const userId = req.params.id
    return Contact.findByPk(userId).then((contacts) => {
        res.send({data: contacts});
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the contact."
      });
    });
};

// Update a contact by the id in the request
exports.update =async (req, res) => {

    if (!req.body) {
      res.status(400).send({
          message: "Content can not be empty!"
      });
      return;
  }
  let invitation=await Invitation.findOne( {
    where: { userId: req.body.userId,contactId: req.body.id }
  })
    if (invitation) {
        res.status(400).send({
            error: "Invitation already sent!,You cannot modify contact now"
        });
        return;
    }
	let totalGuest= await contact.sum('totalGuest',{
        where : {userId : req.user.id}
    })
    let contactData = req.body
    const id = req.params.id;
	const contact_db= await Contact.findByPk(id);
	totalGuest=totalGuest-contact_db.totalGuest;
	if((totalGuest+contactData.totalGuest)<=req.user.totalGuestAllowed){
    contact.update(contactData, {
        where: { id: id }
      })
        .then(num => {
          if (num == 1) {
            res.send({
              message: "Contact was updated successfully."
            });
          } else {
            res.send({
              message: `Cannot update Contact with id=${id}. Maybe Contact was not found or req.body is empty!`
            });
          }
        })
        .catch(err => {
          res.status(500).send({
            message: "Error updating Contact with id=" + id
          });
        });
			}else{
		res.status(500).send({
        message:
           "You are note allowed to invite "+contactData.totalGuest+" more Guests"
      })
	}
};

// Delete a contact with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;

    contact.destroy({
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

// Delete all contacts from the database.
exports.deleteAll = (req, res) => {
  
};