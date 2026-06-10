const express = require('express');
const router = express.Router();
const { getSnippets, addSnippet, editSnippet, deleteSnippet, getSnippetById } = require("../controllers/snippetController");
const validateToken = require("../middleware/validateToken_handler");
const validateAdmin = require("../middleware/validateAdmin_handler");

router.route('/').get(getSnippets).post(validateToken, validateAdmin, addSnippet);
router.route('/:id').get(getSnippetById).put(validateToken, validateAdmin, editSnippet).delete(validateToken, validateAdmin, deleteSnippet);

module.exports = router;