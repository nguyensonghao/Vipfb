const express = require('express');
const router = express.Router();

const ToolController = require('./../controllers/tool.controller');

router.post('/add-friend', ToolController.addFriend);
module.exports = router;