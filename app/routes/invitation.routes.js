
const invitations = require("../controllers/invitation.controller.js");

var router = require("express").Router();

// Create a new invitation
router.post("/create/single", invitations.create);

// // Retrieve all invitations
// router.get("/all/:id", invitations.findAll);

// // Retrieve all invitations stats //moved to mobile ap backend
// router.post("/stats", invitations.getAllStats);

// // Retrieve a single invitation with id
// router.get("/:id", invitations.findOne);

// // Update a invitation with id
// router.patch("/:id", invitations.update);
// // Update a invitation with id by inviter
// router.patch("/inviter_action/:id", invitations.updateByInviter);

// // Delete a invitation with id
// router.delete("/:id", invitations.delete);

// // Delete all invitations
// router.delete("/", invitations.deleteAll);

// // Retrieve a single invitation with id
// router.post("/student", invitations.findOneStudent);

// // Invite Student
// router.post("/invitestudent", invitations.inviteStudent)
// router.post("/preview_invitation", invitations.generatePreviewQrCode)

module.exports = router; 