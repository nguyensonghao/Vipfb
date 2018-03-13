const express = require('express');
const router = express.Router();

const ToolController = require('./../controllers/tool.controller');

router.get('/add-friend', ToolController.showAddFriend);
router.get('/log', ToolController.log);
module.exports = router;