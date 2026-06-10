const express = require('express');
const router = express.Router();
const { getCategories, addCategory, editCategory, deleteCategory, getCategoryById } = require("../controllers/categoryController");
const validateToken = require("../middleware/validateToken_handler");
const validateAdmin = require("../middleware/validateAdmin_handler");

router.route("/").get(getCategories).post(validateToken, validateAdmin, addCategory);
router.route("/:id").get(getCategoryById).put(validateToken, validateAdmin, editCategory).delete(validateToken, validateAdmin, deleteCategory);

module.exports = router;