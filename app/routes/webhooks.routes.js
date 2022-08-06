const webhooksController = require("../controllers/webhooks.controller.js");
const router = require("express").Router();

router.post("/whatsapp/response", webhooksController.customerResponse);
module.exports = router; 