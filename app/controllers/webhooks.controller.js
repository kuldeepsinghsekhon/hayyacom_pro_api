
const db = require("../models");
const Invitation = db.Invitations;


exports.customerResponse = async (req, res) => {

  let data=req.body;
  console.log(data)
    res.send({ data: "invitation" });
  };