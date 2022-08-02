const db = require("../models");
const User = db.User;
const Op = db.Sequelize.Op;
const generateAccessToken = require("../utils/token");
// Create and Save a new User
exports.login = (req, res) => {
    // Validate request
    if (!req.body) {
        res.status(400).send({
        message: "Content can not be empty!"
        });
        return;
    }
    let userData = req.body
    User.findOne({where: { phoneNumber: userData.phoneNumber, password: userData.password },include:{
    model: db.WEvent,
    as: 'events', order: 'DESC'/*,where:{eventSchedule:'gfd'}*/
  } })
    .then( async data => {
        if (data){
            const token = await generateAccessToken({email: data.email, id: data.id,totalGuestAllowed:data.totalGuestAllowed})
            res.send({data,token, "message": "Login Successfull!"});
        } else {
            res.status(401).send({"message": "Login Failed! Try again"});
        }
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the User."
      });
    });
};