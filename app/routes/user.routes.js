
const users = require("../controllers/user.controller.js");

var router = require("express").Router();

// Create a new user
router.post("/", users.create);

// Retrieve all users
router.get("/", users.findAll);

// Retrieve a single user with id
router.get("/:id", users.findOne);

// Update a user with id
router.put("/:id", users.update);

// Delete a user with id
router.delete("/:id", users.delete);

// Delete all users
router.delete("/", users.deleteAll);

module.exports = router; 