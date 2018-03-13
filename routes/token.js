const express = require('express');
const router = express.Router();

const TokenController = require('./../controllers/token.controller');

router.get('/add', TokenController.showAdd);
router.get('/list', TokenController.list);
router.get('/:id', TokenController.detail);
router.get('/delete/:id', TokenController.delete);
router.post('/add', TokenController.add);
router.post('/update', TokenController.update);
router.get('/get-information/:token', TokenController.getInformation);
module.exports = router;