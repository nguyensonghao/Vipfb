const express = require('express');
const router = express.Router();

const ToolController = require('./../controllers/tool.controller');

router.get('/add-friend', ToolController.showAddFriend);
module.exports = router;