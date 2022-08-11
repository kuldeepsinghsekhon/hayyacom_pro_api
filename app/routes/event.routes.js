
const events = require("../controllers/event.controller.js");

var router = require("express").Router();

// Create a new event
router.post("/", events.create);

// Retrieve all events
router.get("/user/:id", events.UserEvents);

// Retrieve a single event with id
router.get("/:id", events.findOne);

// Update a event with id
router.patch("/:id", events.update);

// Delete a event with id
router.delete("/:id", events.delete);

// Delete all events
router.delete("/", events.deleteAll);

module.exports = router; 