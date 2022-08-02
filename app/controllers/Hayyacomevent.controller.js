const db = require("../models");
const HayyacomEvent = db.HayyacomEvent;
const PartyHall = db.PartyHall;
const Inviter = db.Inviter;
const Guestlistpaper=db.Guestlistpaper;
const Op = db.Sequelize.Op;
const multer = require("multer");
const path = require("path");
const fs = require("fs");
exports.create = async (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
    return;
  }
  let eventData = req.body
  let count = await HayyacomEvent.findOne({ order: [['id', 'DESC'],] })
  eventData.id = count.id + 1;
 // console.log(eventData)
  let result = await HayyacomEvent.create(eventData).catch(err => {
    		res.status(500).send({
    		  message:
    			err || "Some error occurred while creating the Event."
    		});
    	  });
        if(result){
          await Guestlistpaper.create({eventid:eventData.id,attendedguest:0}).catch(err => console.log(err))
        }
 
  console.log('result',result)
  res.status(200).send({
    data:result,err:false
  });
	 
}

// Retrieve all Events from the database.
exports.findAll = (req, res) => {
  //{where : {userId: req.params.id} }
  let eventData = req.body
  //res.send({data: eventData.date});
  console.log(eventData);
  //Event.findOne({where : {userId: req.user.id} }).then(event => {
  //$between: [startDate, endDate]
  const fromDate = new Date(eventData.fromdate);
  const toDate = new Date(eventData.todate);
  console.log(fromDate)
  console.log(toDate)
  HayyacomEvent.findAll({
    where: { "date": { [Op.between]: [fromDate, toDate] } }, include: [{
      model: PartyHall,
      as: 'partyhall',
      required: false
    }, {
      model: Inviter,
      as: 'inviters',
      required: false
    }]
  }).then(event => {
    if (!event) {
      res.status(401).send({
        message: "Event doesn't exist"
      });
    } else {
      res.send({ data: event });
    }
  }).catch(err => {
    res.status(500).send({
      message:
        err.message || "Some error occurred while creating the Event."
    });
  })
};
exports.findOne = (req, res) => {
  //{where : {userId: req.params.id} }
  const id = req.params.id
  //res.send({data: eventData.date});

  HayyacomEvent.findOne({
    where: { "id": id }, include: [{
      model: PartyHall,
      as: 'partyhall',
      required: false
    }, {
      model: Inviter,
      as: 'inviters',
      required: false
    }]
  }).then(event => {
    if (!event) {
      res.status(401).send({
        message: "Event doesn't exist"
      });
    } else {
      res.send({ data: event });
    }
  }).catch(err => {
    res.status(500).send({
      message:
        err.message || "Some error occurred while creating the Event."
    });
  })
};

exports.searchOne = (req, res) => {
  //{where : {userId: req.params.id} }
  let q = req.body.q.toString()
  console.log(q.toString())
 // res.send(q);

  HayyacomEvent.findAll({
    where: { "eventtitle":{[Op.like]:q+'%'}}
    //  include: [{
    //   model: PartyHall,
    //   as: 'partyhall',
    //   required: false
    // }, {
    //   model: Inviter,
    //   as: 'inviters',
    //   required: false
    // }]
  }).then(event => {
    if (!event) {
      res.status(200).send({ data: [] });
    } else {
      res.send({ data: event });
    }
  }).catch(err => {
    console.log(err)
    res.status(500).send({
      message:
        err.message || "Some error occurred while creating the Event."
    });
  })
};

exports.update=async (req,res)=>{
  let eventData = req.body
  let id = eventData.id ;
  console.log(eventData)
 delete eventData.id;
  let result = await HayyacomEvent.update(eventData,{where:{id:id}}).catch(err => {
    console.log(err)
    		res.status(500).send({
    		  message:
    			err || "Some error occurred while creating the Event."
    		});
    	  });
 if(result){
  res.status(200).send({
    data:result,err:false
  });}
}
