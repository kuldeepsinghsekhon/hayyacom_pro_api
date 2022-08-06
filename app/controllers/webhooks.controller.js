
const db = require("../models");
const Invitation = db.Invitations;


exports.customerResponse = async (req, res) => {

  
    res.send({ data: "invitation" });
  };