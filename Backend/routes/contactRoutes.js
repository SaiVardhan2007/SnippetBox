const express = require('express')
const router = express.Router()
const {getContacts, editContact, deleteContact, getContact, addContact} = require("../controllers/contactController")
const validateToken =  require("../middleware/validateToken_handler")

router.use(validateToken)
router.route("/").get(getContacts)
router.route("/").post(addContact)
router.route("/:id").put(editContact)
router.route("/:id").get(getContact)  
router.route("/:id").delete(deleteContact)


module.exports = router;
