const db = require("../models");
const HayyacomEvent = db.HayyacomEvent;
const PartyHall = db.PartyHall;
const Inviter = db.Inviter;
const Guestlist = db.Guestlist;
const PreviewInviter = db.PreviewInviter;

const Guestlistpaper = db.Guestlistpaper;
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
  const tempPath = req?.file?.path;
  let obj = JSON.parse(JSON.stringify(req.body)).document;
  obj = JSON.parse(obj)
  if(tempPath){
   let  filename = 'appevent' + obj?.mobile + path?.extname(req?.file?.originalname)?.toLowerCase()
     const targetPath = `\\temp\\${filename}`;
     obj.entranceURL = `https://hayyacom.net/public/photo/iflowerinvitation/${filename}`;
    // obj.entranceURL = `http://localhost:3003/temp/${filename}`;

     fs.rename(tempPath, targetPath, err => {
      if (err) console.log('file rename error', err);
    });
  }

  let condition = { where: { mobile: obj?.mobile, eventid: obj?.eventid } };
  let inviter = await Inviter.findOne(condition)
  //console.log('find inviter',inviter)
  if (inviter) {
    delete obj.mobile
    delete obj.eventid
    console.log(obj)
    await inviter.update({...obj});
     inviter=await inviter.save();
     res.status(200).send(inviter);
  } else {
    inviter = await Inviter.create(obj).catch(err => {
      console.log(err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Inviter."
      });
    })
    if(inviter){
      res.status(200).send(inviter);
    }
  }

 // res.send(inviter);
}
exports.createPreviewInviter = async (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
    return;
  }
  const tempPath = req?.file?.path;
  let obj = JSON.parse(JSON.stringify(req.body)).document;
  obj = JSON.parse(obj)
  if(tempPath){
   let  filename = 'appevent' + obj?.mobile + path?.extname(req?.file?.originalname)?.toLowerCase()
   let targetPath=`\\Users\\hekin\\Desktop\\hayyacom\\hayyacom-watsapp-dev/wedding-invitation-dev-localhost\\frontend-receptionist\\public\\temp\\${filename}`

    // const targetPath = `\\temp\\${filename}`;
     obj.entranceURL = `http://localhost:3003/temp/${filename}`;
     fs.rename(tempPath, targetPath, err => {
      if (err) console.log('file rename error', err);
    });
  }

  let condition = { where: { mobile: obj?.mobile, eventid: obj?.eventid } };
  let inviter = await PreviewInviter.findOne(condition)
  //console.log('find inviter',inviter)
  if (inviter) {
    delete obj.mobile
    delete obj.eventid
    await inviter.update({...obj});
     inviter=await inviter.save();
        
  } else {
    inviter = await PreviewInviter.create(obj).catch(err => {
      console.log(err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Inviter."
      });
    })
  }

  res.send(inviter);
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
  let eventid = req.body.eventid
  let mobile = req.body.mobile

 // res.send(q);

 Inviter.findOne({
    where: { "eventid":eventid,mobile:mobile}
    //  include: [{
    //   model: PartyHall,
    //   as: 'partyhall',
    //   required: false
    // }
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
exports.searchOnePreview = (req, res) => {
  //{where : {userId: req.params.id} }
  let id = req.body.id
 
  PreviewInviter.findOne({
    where: { "id":id}
   
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


exports.SearchByMobile = (req, res) => {
  //{where : {userId: req.params.id} }
  let q = req.body.q.toString()
  console.log(q.toString())
 // res.send(q);
//{"mobile":{[Op.like]:q+'%'} },
//{"eventid":{[Op.like]:q+'%'} }
 Inviter.findAll({
    where: { [Op.or]: [{"mobile":{[Op.like]:q+'%'} },{"name":{[Op.like]:q+'%'} }]}
    //  include: [{
    //   model: PartyHall,
    //   as: 'partyhall',
    //   required: false
    // }, {
    //   model: Inviter,
    //   as: 'inviters',
    //   required: false
    // }]
  }).then(inviter => {
    if (!inviter) {
      res.status(200).send({ data: [] });
    } else {
      res.send({ data: inviter });
    }
  }).catch(err => {
    console.log(err)
    res.status(500).send({
      message:
        err.message || "Some error occurred while creating the inviter."
    });
  })
};

exports.delete_invitations=async (req,res)=>{
  const eventid = req.params.eventid;
  const SN = req.params.SN;
  Guestlist.destroy({
    where: { eventid: eventid,SN:SN }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "guest was deleted successfully!"
        });
      } else {
        res.status(404).send({
          message: `Cannot delete guest with eventid=${eventid} mobile ${SN}. Maybe guests was not found!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete guests with eventid=" + eventid+" mobile"+SN
      });
    });
}
exports.get_guestlists=async (req,res)=>{

  const invitermobile = req.params.invitermobile;
  console.log('invitermobile',invitermobile)
let  guestlists=await Guestlist.findAll({attributes:['invitermobile','SN','guestname','eventid'],
    where: { invitermobile: invitermobile}
  }).catch(err => {
      res.status(500).send({
        message: "Could not delete guests with eventid=" + eventid+" mobile"+invitermobile
      });
    });
    return res.send({data: guestlists});
}