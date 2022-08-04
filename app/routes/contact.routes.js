const contacts = require("../controllers/contact.controller.js");

var router = require("express").Router();

// Create a new bulk contact
router.post("/create/bulk", contacts.createBulk);

// Create a new contact
router.post("/create/single", contacts.create);

// Retrieve all contacts
router.get("/all/:id/:EventId", contacts.findAll);

// Retrieve a single contact with id
router.get("/:id", contacts.findOne);

// Update a contact with id
router.patch("/:id", contacts.update);

// Delete a contact with id
router.delete("/:id", contacts.delete);

// Delete all contacts
router.delete("/", contacts.deleteAll);

module.exports = router; 