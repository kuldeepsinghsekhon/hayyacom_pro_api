const db = require("../models");
const Invitation = db.Invitations;
const Invitationseq = db.Invitationsseq;
const Contacts = db.Contacts;
const Events = db.Events;
const Users = db.Users;
const Students = db.Students;
const Op = db.Sequelize.Op;
const User_Event = db.User_Event;
const mysql = require('mysql2');
const QRCode = require('qrcode')
const fs = require('fs');
const PreviewInviter = db.PreviewInviter;
const { registerFont, createCanvas, loadImage, Image } = require('canvas')
// Create and Save a new Invitation
exports.create = async (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
    return;
  }
  let invitationData = req.body
  const eventId = invitationData.eventId;
  const invitations = await Invitation.findAll({ where: { eventId: eventId } })
  let invitation_ids = [];
  invitation_ids = invitations.map((inv) => {
    return parseInt(inv.id.replace(eventId, ""))
  })
  //invitation_ids=[5,8]
  const invitationid = invitation_ids.length != 0 ? Math.max(...invitation_ids) + 1 : 100;
  //console.log('invitation_ids',invitation_ids, 'invitation_ids.length',invitation_ids.length)
  // console.log('invitationid',invitationid)
  Invitation.findOne({ where: { "contactId": req.body.contactId } }).then(invitation => {

    if (invitation) {
      res.status(200).send({ data: invitation });
    } else {
      invitationData.id = eventId + invitationid;
      console.log(eventId + invitationid)
      console.log('invitationData', invitationData)
      Invitation.create(invitationData)
        .then(data => {
          res.status(200).send({ data });
        })
        .catch(err => {
          res.status(500).send({
            message:
              err.message || "Some error occurred while creating the Invitation."
          });
        });
    }
  }).catch(err => {
    res.status(500).send({
      message:
        err || "Some error occurred while creating the Invitation."
    });
  })
};

// Retrieve all Invitations from the database.
exports.findAll = async (req, res) => {
  let invitation = await Invitation.findAll({ where: { userId: req.params.id }, include: [{ model: Contacts, as: 'contact' }, { model: Events, as: 'event' }, { model: Users, as: 'user' }] })
  //console.log(invitation)
  let Accepted = await Invitation.findAll({ where: { userId: req.params.id, status: 'Accepted' }, include: [{ model: Contacts, as: 'contact' }, { model: Events, as: 'event' }, { model: Users, as: 'user' }] })
  let Rejected = await Invitation.findAll({ where: { userId: req.params.id, status: 'Rejected' }, include: [{ model: Contacts, as: 'contact' }, { model: Events, as: 'event' }, { model: Users, as: 'user' }] })
  let Attended = await Invitation.findAll({ where: { userId: req.params.id, status: 'Accepted', attended: { [Op.gt]: 0 } }, include: [{ model: Contacts, as: 'contact' }, { model: Events, as: 'event' }, { model: Users, as: 'user' }] })
  let NotReplied = await Invitation.findAll({ where: { userId: req.params.id, status: { [Op.is]: null } }, include: [{ model: Contacts, as: 'contact' }, { model: Events, as: 'event' }, { model: Users, as: 'user' }] })

  //console.log(req.params.id)
  res.send({ data: { invitation: invitation, Accepted: Accepted, Rejected: Rejected, Attended: Attended, NotReplied: NotReplied } });
  //     res.status(500).send({
  //       message:
  //         err.message || "Some error occurred while creating the Invitation."
  //     });
};

//Find a single Invitation with an id//{ model: Events, as: 'event' },
exports.findOne = async (req, res) => {

  const invitation = await Invitation.findOne({ where: { "id": req.params.id }, include: [{ model: Events, as: 'event' }, { model: Users, as: 'user' }, { model: Contacts, as: 'contact' }] });
  const user_event = await User_Event.findOne({ where: { "UserId": invitation.user.id, "WEventId": invitation.event.id } })
  console.log('invitation', invitation)
  //invitation.event.User_Event=user_event.dataValues;
  //console.log(user_event.invitationLink)
  // if (user_event?.invitationLink != null) {
  //   invitation.event.invitationLink = user_event?.invitationLink
  // }
  res.send({ data: invitation });
};

// Update a Invitation by the id in the request
exports.update = async (req, res) => {
  // Validate request
  console.log('req.body', req.body)
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
    return;
  }
  let invitationData = req.body
  const id = req.body.id;
  let invitation = await Invitation.findOne({ where: { id: id } });
  if (invitation?.status == 'Rejected' && invitationData.status == 'Accepted') {
    res.status(401).send({
      message: (user_event.language == 'en') ? "You cannot change invitation status. Please contact inviter to modify your status" : ".لايمكنك تغيير حالة الدعوة، فضلاً إبلاغ صاحب المناسبة لتعديل الحالة"
    });
  } else {
    let contact = await Contacts.update({ totalGuest: req.body.totalGuest }, { where: { id: invitation.contactId } }).catch(err => console.log(err))
    Invitation.update({ "status": invitationData.status }, {
      where: { id: id }
    })
      .then(num => {
        res.send({
          message: "Invitation was updated successfully."
        });
      })
      .catch(err => {
        console.log(err, "err")
        res.status(500).send({
          message: "Error updating Invitation with id=" + id
        });
      });
  }
};

exports.updateByInviter = async (req, res) => {
  // Validate request
  console.log('req.body', req.body)
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
    return;
  }
  let invitationData = req.body
  const id = req.body.id;
  //let invitation = await Invitation.findOne({ where: { id: id } });

  Invitation.update({ "status": invitationData.status }, {
    where: { id: id }
  })
    .then(num => {
      res.send({
        message: "Invitation was updated successfully."
      });
    })
    .catch(err => {
      console.log(err, "err")
      res.status(500).send({
        message: "Error updating Invitation with id=" + id
      });
    });
};
// Get the stats of all the Invitaions
/* exports.getAllStats = async (req, res) => {
    //, status: { [Op.not]: 'Decline'}
    try {
  const user= await Users.findOne({where : {id: req.params.id}})
	
       // const totalCount = await Invitation.count({where : {userId: req.params.id}})
     // const totalCount = await Contacts.sum('totalGuest',{where : {userId: req.params.id}})
        const declinedCount = await Invitation.count({where : {userId: req.params.id, status: "Rejected"}})
        const acceptCount = await Invitation.count({where : {userId: req.params.id, status: "Accepted"}})
        const nullCount = await Invitation.count({where : {userId: req.params.id, status: null}})
  const  totalGuestAllowed =user.totalGuestAllowed
          const totalCount =acceptCount+nullCount+declinedCount //await Invitation.count('totalGuest',{where : {userId: req.params.id}})
        res.send({data : {totalCount, declinedCount, acceptCount, nullCount,totalGuestAllowed}});
    } catch (err) {
        console.log(err, "err")
        res.status(500).send({
            message: "Something went wrong please try again later !!"
        });
    }
} */
var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'hayyacom'
});
exports.getAllStats = (req, res) => {

  var userid = req.body.userid;
  var eventid = req.body.eventid;
  if (req.body.eventid) {
    //get the value from the button pressed ( either 1, or 2, or 3.... or 5)
    //userid = parseInt(guestnumber.userid||"0");//this is same as previous line, you don't need this as here I was getting the value from an array 
    // if(eventid.includes("W")){
    try {
      connection.query('SELECT sum(totalGuest) as totalGuest FROM hayyacom.`Invitations` A inner join hayyacom.`Contacts` B on B.id = A.contactId where A.eventId ="' + eventid + '"  and A.userId = ' + userid, (err, guestattended_rows) => {
        connection.query('SELECT sum(totalGuest) as totalGuest FROM hayyacom.`Invitations` A inner join hayyacom.`Contacts` B on B.id = A.contactId where A.eventId ="' + eventid + '" and A.status = "Accepted"  and A.userId = ' + userid, (err, accepted_rows) => {
          connection.query('SELECT sum(totalGuest) as totalGuest FROM hayyacom.`Invitations` A inner join hayyacom.`Contacts` B on B.id = A.contactId where A.eventId ="' + eventid + '" and A.status = "Rejected"  and A.userId = ' + userid, (err, rejected_rows) => {

            connection.query('SELECT totalGuestAllowed  FROM hayyacom.`Users` A  where  A.id = ' + userid, (err, totalguest_rows) => {
              connection.query('SELECT sum(totalGuest) as totalGuest FROM hayyacom.`Invitations` A inner join hayyacom.`Contacts` B on B.id = A.contactId where A.eventId ="' + eventid + '" and A.status is null  and A.userId = ' + userid, (err, nullCount_rows) => {

                console.log('guestattended', accepted_rows)
                let nullCount = nullCount_rows[0]?.totalGuest
                if (nullCount == null) {
                  nullCount = 0
                }
                connection.query('SELECT sum(attended) as totalGuest FROM hayyacom.`Invitations` A inner join hayyacom.`Contacts` B on B.id = A.contactId where A.eventId ="' + eventid + '" and A.userId = ' + userid, (err, attended_rows) => {

                  connection.query('SELECT count(A.id) as total FROM hayyacom.`Contacts` A WHERE id NOT IN  (SELECT contactId FROM hayyacom.`Invitations` B WHERE B.contactId = A.id) and userId =' + userid, (err, notinvited_rows) => {

                    console.log("query is=============================", totalguest_rows)
                    res.status(200).send({ "totalGuestAllowed": totalguest_rows[0]?.totalGuestAllowed, "totalCount": guestattended_rows[0]?.totalGuest, "acceptCount": accepted_rows[0]?.totalGuest, "declinedCount": rejected_rows[0]?.totalGuest, "nullCount": nullCount, "attendedCount": attended_rows[0]?.totalGuest, notinvitedCount: notinvited_rows[0]?.total });

                  })
                })
              })
            })
          })
        })
      })
    } catch (err) {
      console.log(err)
    }
  } else {
    res.status(200).send({ "totalGuestAllowed": 0, "totalCount": 0, "acceptCount": 0, "declinedCount": 0, "nullCount": 0 });

  }
}


///show form value
exports.findOneStudent = async (req, res) => {
  var studentID = req.body.studentID
  var token = req.body.token
  const student = await Students.findOne({ where: { "studentID": studentID, "token": token } });
  if (student) {
    res.send({ data: student });
  } else {
    res.status(400).send({ error: true, data: {} });
  }

};

///////////////////
//inserting guest ( when user click save) :
exports.inviteStudent = async (req, res) => {

  var eventid = req.body.eventid //this one supposed to be obtained from session 
  var invitermobile = req.body.invitermobile;// //this one supposed to be obtained from session 
  var email = req.body.email != undefined ? req.body.email : null;
  var children = req.body.childrenperguest != undefined ? req.body.childrenperguest : null;
  allowedguestperinviter = 3;
  var guestname = req.body.guestname != undefined ? req.body.guestname : null;// guest name
  var totalperguest = req.body.guestpercard;// total guest 
  var studentID = req.body.studentID
  var token = req.body.token
  var guestmobile = studentID;
  var guestmobile1 = req.body.nationalID1 != undefined ? req.body.nationalID1 : null;
  var guestmobile2 = req.body.nationalID1 != undefined ? req.body.nationalID1 : null;
  var coguestname1 = req.body.coguestname1 != undefined ? req.body.coguestname1 : null;// guest name
  var coguestname2 = req.body.coguestname2 != undefined ? req.body.coguestname2 : null;// guest name
  const student = await Students.findOne({ where: { "studentID": studentID, "token": token } });

  if (student) {

    connection.query('SELECT invitationurl FROM guestlist WHERE guestgroup="' + guestmobile + '"', (err, rowsinv) => {
      if (rowsinv.length != 0) {
        // console.log("already",rowsinv[0]); 
        res.status(200).send({ "success": 0, "message": "Guests Aleady exist!", "SN": rowsinv });

      } else {
        connection.query('SELECT SN FROM guestlist WHERE eventid="' + eventid + '" ORDER BY SN DESC LIMIT 1', (err, rows) => {

          if (err) throw err;
          if (rows.length != 0) {
            if (rows[0].SN >= eventid * 1000)
              var SN = rows[0].SN + 1;
          } else {
            var SN = (eventid * 1000) + 100;
          }


          connection.query('insert into guestlist (SN, guestname, totalperguest, guestmobile,guestgroup, invitermobile, eventid, time, email,children) values("' + SN + '","' + guestname + '","' + totalperguest + '","' + guestmobile + '","' + guestmobile + '","' + invitermobile + '","' + eventid + '", now(), "' + email + '", "' + children + '")', (err, studentrows) => {
            SN1 = SN + 1

            connection.query('insert into guestlist (SN, guestname, totalperguest, guestmobile,guestgroup, invitermobile, eventid, time, email,children) values("' + SN1 + '","' + coguestname1 + '","' + totalperguest + '","' + guestmobile1 + '","' + guestmobile + '","' + invitermobile + '","' + eventid + '", now(), "' + email + '", "' + children + '")', (err, coguest1) => {
              SN2 = SN1 + 1

              connection.query('insert into guestlist (SN, guestname, totalperguest, guestmobile,guestgroup, invitermobile, eventid, time, email,children) values("' + SN2 + '","' + coguestname2 + '","' + totalperguest + '","' + guestmobile2 + '","' + guestmobile + '","' + invitermobile + '","' + eventid + '", now(), "' + email + '", "' + children + '")', (err, coguest2) => {
                let url = [];

                url[0] = generateStudentQrCode(eventid, invitermobile, SN, coguestname2, totalperguest)
                url[1] = generateStudentQrCode(eventid, invitermobile, SN1, guestname, totalperguest)
                url[2] = generateStudentQrCode(eventid, invitermobile, SN2, coguestname1, totalperguest)
                if (err) throw err;
                res.status(200).send({ "success": 1, "message": "Guests invited successfully!", "SN": url });
              });
            });
          });
        })
      }
    })
  } else {
    res.status(200).send({ "success": 1, "message": "invalid id or token!" })
  }
}

/////////////////
// generate QR code for Student
const generateStudentQrCode = (eventid, mobileNumber, SN, name, guests) => {
  if (mobileNumber != '') {
    connection.query('SELECT * FROM inviters WHERE eventid = "' + eventid + '" AND mobile = "' + mobileNumber + '" ', (err, rows) => {
      if (err) throw err;
      if (!rows.length)
        return res.status(400).send({ "ErrorMessage": "Unauthorized!" });
      let qr_code_file_name = SN + '.png';
      var opts = {
        errorCorrectionLevel: 'H',
        type: 'image/png',
        quality: 0.95, //0.95
        color: {
          dark: rows[0].QRcolor, //'#a46716',  // Hayyacam QR color a46716
          light: '#0000' // Transparent background
        }
      }
      QRCode.toDataURL(String(SN), opts, function (err, url) {
        //  console.log(url)
        var w = 0;
        var h = 0;
        loadImage(rows[0].entranceURL).then((image) => {
          w = image.naturalWidth;
          h = image.naturalHeight;
          const canvas = createCanvas(w, h)
          const ctx = canvas.getContext('2d')
          loadImage(rows[0].entranceURL).then((image2) => {
            var width = image2.naturalWidth;
            var height = image2.naturalHeight;
            ctx.drawImage(image2, 0, 0, width, height)
            loadImage(url).then((img) => {
              let qrw = parseInt(rows[0].QRsize);
              ctx.drawImage(img, w * rows[0].QRW, h * rows[0].QRH, qrw, qrw)
              ctx.font = "'" + rows[0].TextType + "'";  //'48px DTNASKH0'; //"'"+ rows[0].TextType +"'"; //'48px Impact';
              ctx.fillStyle = rows[0].Textcolor; //"#a46716";//a46716
              ctx.fillText(rows[0].numberMessage + " " + guests, w * rows[0].NumberW, h * rows[0].NumberH) //w*0.4, h*0.69
              ctx.textAlign = "center";
              ctx.fillText(rows[0].textTitle + " " + name, w * 0.5, h * rows[0].TextH) //w*0.4, h*0.65  // w*rows[0].TextW
              // ctx.fillText(rows[0].numberMessage+ " " +no_of_guests , w*rows[0].NumberW, h*rows[0].NumberH) //w*0.4, h*0.69
              ctx.font = '48px Impact';
              if (rows[0].SNW == null)
                ctx.fillText(SN, (w * 0.5), (h * rows[0].QRH - 10))   // w*rows[0].QRW + 20
              else
                ctx.fillText(SN, (w * 0.5), (h * rows[0].SNH))     // w*rows[0].SNW

              var base64Data = canvas.toDataURL().replace(/^data:image\/png;base64,/, "");

              fs.writeFile("/home/tarneem/Hayyacom/public/inviteQRImage/" + qr_code_file_name, base64Data, 'base64', function (err) {
                console.log(err);
                let url = `https://hayyacom.net/public/inviteQRImage/${qr_code_file_name}`
                connection.query('update guestlist set invitationurl="' + url + '" where SN="' + SN + '" ', (err, rows) => {

                })
                return url;
                //require('child_process').execSync(`cp public/inviteQRImage/${qr_code_file_name} /home/tarneem/Hayyacom/public/inviteQRImage/`);
                //return {"success": 1, "inviteImageUrl": `https://hayyacom.net/public/inviteQRImage/${qr_code_file_name}`,"LocationURL":rows[0].LocationURL,"Message":rows[0].Message}                            
              });
            });
          })
        });
      })
    })
  }
  else {
    return res.status(400).send({ "ErrorMessage": "Error in generating QR code!" });
  }

}

// Delete a Invitation with the specified id in the request
exports.delete = (req, res) => {

};

// Delete all Invitations from the database.
exports.deleteAll = (req, res) => {

};
exports.generatePreviewQrCode = (req, res) => {

  var id = req.body.id //this one supposed to be obtained from session 
  var eventid = req.body.eventid //this one supposed to be obtained from session 
  var mobileNumber = req.body.mobileNumber;// //this one supposed to be obtained from session 
  var SN = req.body.SN;
  var name = req.body.email != undefined ? req.body.email : null;
  var childrenperguest = req.body.childrenperguest != undefined ? req.body.childrenperguest : null;
  var guests = req.body.guests;// total guest 
  try {


    if (id != '') {
      connection.query('SELECT * FROM previewinviter WHERE id = "' + id + '" ', (err, rows) => {
        if (err) throw err;
        console.log(rows)
        if (!rows.length)
          return res.status(400).send({ "ErrorMessage": "Unauthorized!" });
        let qr_code_file_name = mobileNumber + '.jpg';
        var opts = {
          errorCorrectionLevel: 'H',
          type: 'image/png',
          quality: 0.95, //0.95
          color: {
            dark: rows[0].QRcolor, //'#a46716',  // Hayyacam QR color a46716
            light: '#0000' // Transparent background
          }
        }
        QRCode.toDataURL(String(SN), opts, function (err, url) {
          console.log(url)
          console.log(SN)
          var w = 0;
          var h = 0;
          // rows[0].entranceURL=  "https://hayyacom.net/public/photo/iflowerinvitation/entrance555.jpg"
          console.log('rows[0].entranceURL', rows[0].entranceURL)
          loadImage(rows[0].entranceURL).then((image) => {
            w = image.naturalWidth;
            h = image.naturalHeight;
            const canvas = createCanvas(w, h)
            const ctx = canvas.getContext('2d')

            loadImage(rows[0].entranceURL).then((image2) => {
              var width = image2.naturalWidth;
              var height = image2.naturalHeight;
              ctx.drawImage(image2, 0, 0, width, height)
              console.log(0, 0, width, height)
              loadImage(url).then((img) => {
                let qrw = parseInt(rows[0].QRsize);
                ctx.drawImage(img, w * rows[0].QRW, h * rows[0].QRH, qrw, qrw)
                ctx.font = "'" + rows[0].TextType + "'";  //'48px DTNASKH0'; //"'"+ rows[0].TextType +"'"; //'48px Impact';
                ctx.fillStyle = rows[0].Textcolor; //"#a46716";//a46716
                ctx.fillText(rows[0].numberMessage + " " + guests, w * rows[0].NumberW, h * rows[0].NumberH) //w*0.4, h*0.69
                ctx.textAlign = "center";
                ctx.fillText(rows[0].textTitle + " " + name, w * 0.5, h * rows[0].TextH) //w*0.4, h*0.65  // w*rows[0].TextW
                // ctx.fillText(rows[0].numberMessage+ " " +no_of_guests , w*rows[0].NumberW, h*rows[0].NumberH) //w*0.4, h*0.69
                ctx.font = '48px Impact';
                if (rows[0].SNW == null)
                  ctx.fillText(SN, (w * 0.5), (h * rows[0].QRH - 10))   // w*rows[0].QRW + 20
                else
                  ctx.fillText(SN, (w * 0.5), (h * rows[0].SNH))     // w*rows[0].SNW

                var base64Data = canvas.toDataURL().replace(/^data:image\/png;base64,/, "");
                //console.log(base64Data)
                //  return res.status(200).send({ "image": base64Data });
                ///home/tarneem/Hayyacom/public/inviteQRImage/
                let pathurl = '/Users/hekin/Desktop/hayyacom/hayyacom-watsapp-dev/wedding-invitation-dev-localhost/frontend-receptionist/public/temp/'
                //"\/temp\\"               
                fs.writeFile(pathurl + qr_code_file_name, base64Data, 'base64', function (err) {
                  console.log(err);
                  // let url=`https://hayyacom.net/public/photo/iflowerinvitation/temp/${qr_code_file_name}`
                  let url = `http://localhost:3003/temp/${qr_code_file_name}`

                  //              connection.query('update guestlist set invitationurl="'+url+'" where SN="'+SN+'" ', (err, rows) => {

                  //          })
                  console.log(url)
                  // return url;
                  return res.status(200).send({ "image": url });
                  // //require('child_process').execSync(`cp public/inviteQRImage/${qr_code_file_name} /home/tarneem/Hayyacom/public/inviteQRImage/`);
                  //       //return {"success": 1, "inviteImageUrl": `https://hayyacom.net/public/inviteQRImage/${qr_code_file_name}`,"LocationURL":rows[0].LocationURL,"Message":rows[0].Message}                            
                });
              })
            })
          })
        })
      })

    }

    else {
      return res.status(400).send({ "ErrorMessage": "Error in generating QR code!" });
    }
  } catch (error) {
    console.log(error)
  }

}
