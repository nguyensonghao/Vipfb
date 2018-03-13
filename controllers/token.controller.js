var request = require('request');
var ObjectID = require('mongodb').ObjectID;

var TokenModel = require('../models/token.model');

module.exports = {
	showAdd: function (req, res) {
		res.render('token/add');
	},

	getInformation: function (req, res) {
		var token = req.params.token;
		var url = "https://graph.facebook.com/me?access_token=" + token;
		request.get(url, function (err, response, body) {
			if (err) {
				res.json({status: false});
			} else {
				res.json({status: true, data: JSON.parse(body)});
			}
		})
	},

	add: function (req, res) {
		var token = req.body.token;
		var information = JSON.parse(req.body.information);
		TokenModel.findOne({token: token}, function (err, data) {
			if (data) {
				res.json({status: false, msg: 'Token đã tồn tại!'});
			} else {
				var tokenObj = new TokenModel({
					token: token,
					information: information,
					active: true,
					create_at: new Date(),
					lastUse: null
				})

				tokenObj.save(function (err, data) {
					if (err) {
						res.json({status: false, msg: 'Có lỗi trên server!'});
					} else {
						res.json({status: true});
					}
				})
			}
		})
	},

	list: function (req, res) {
		TokenModel.find(function (err, data) {
			res.render('token/list', {
				list: data
			})
		})
	},

	delete: function (req, res) {
		var id = req.params.id;
		TokenModel.remove({_id: new ObjectID(id)}, function (err, data) {
			res.json({status: true});
		})
	},

	detail: function (req, res) {
		var id = req.params.id;
		TokenModel.findById(id, function (err, data) {
			if (!err && data) {
				res.render('token/detail', {
					token: data
				})
			} else {
				res.render('token/detail', {
					token: null
				})
			}
		})
	},

	update: function (req, res) {
		var id = req.body.id;
		var token = req.body.token;
		TokenModel.update({_id: new ObjectID(id)}, {
			$set: {
				token: token
			}
		}, function (err) {
			if (err) {
				res.json({status: false, msg: 'Có lỗi trên server!'});
			} else {
				res.json({status: true});
			}
		})
	}
}