var phantom = require('phantom');
var base64Img = require('base64-img');
var request = require('request');
var moment = require('moment');

var urlRequest = "https://vipfb.in/request_panel.php";
var url = "https://vipfb.in";
var TokenModel = require('../models/token.model');
var LogModel = require('../models/log.model');

module.exports = {
	showAddFriend: function (req, res) {
		var date = new Date(moment().subtract(5, 'minutes'));
		var condition = {
			active: true,
			$or: [
				{
					lastUse: null
				}, {
					lastUse: {
						$lt: date
					}
				}
			]
		}

		TokenModel.find(condition, function (err, list) {
			list = list ? list : [];
			res.render('addFriends', {
				listToken: list
			});
		})
	},

	log: function (req, res) {
		LogModel.find(function (err, list) {
			list = list ? list : [];
			res.render('tool/log', {
				listLog: list
			})
		})
	},

	addFriend: function (req, res) {
		var token = req.body.token;
		var userId = req.body.userId;
		var _ph, _page;
		phantom.create().then(ph => {
		    _ph = ph;
		    return _ph.createPage();
		}).then(page => {
		    _page = page;
		    _page.property('viewportSize', {width: 900, height: 600}).then(function() {
		        return _page.open(url);
		    });
		}).then(status => {
			setTimeout(function () {
				_page.evaluate(function(token) {
		            document.querySelectorAll('#LoginD input[type="text"]')[0].value = token;
		            document.querySelectorAll('#LoginD button[type="submit"]')[0].click();
		            return 0;
		        }, token);

		    	setTimeout(function () {
		            var time = new Date().getTime();
		            var imageName = './captchaImage/' + time + ".png";
		            captureRequest(userId, _page, imageName, function () {
		            	TokenModel.update({token: token}, {
		            		$set: {
		            			lastUse: new Date()
		            		}
		            	}, function () {
		            		var logModel = new LogModel({
		            			token: token,
							    userId: userId,
							    time: new Date()
		            		})

		            		logModel.save(function () {
		            			setTimeout(function () {
				            		_page.close();
						    		_ph.exit();
						    		res.json({status: true});
								}, 1000);
		            		})
		            	})
		            })
		        }, 5000);
			}, 5000);
		}).catch(() => {
		    _page.close();
		    _ph.exit();
		    res.json({status: false});
		});
	}
}

function captureRequest (userId, page, name, callback) {
	page.property('viewportSize', {width: 900, height: 600}).then(function() {
        return page.open(urlRequest);
    }).then(function () {
        setTimeout(function () {
        	page.evaluate(function() {
	        	return document.querySelectorAll('form center img')[0].getBoundingClientRect();
	        }).then(function (clipRect) {
	        	page.property('clipRect', {
	        		top: clipRect.top,
		            left: clipRect.left,
		            width: clipRect.width,
		            height: clipRect.height
	        	}).then(function () {
	        		page.render(name);
	        		setTimeout(function () {
	        			imageToText(name).then(function (key) {
	        				var captchaText = key;
				        	page.evaluate(function (captchaText, userId) {
		                    	document.querySelectorAll('form input[name="id"]')[0].value = userId;
		                    	document.querySelectorAll('form input[name="captchaBox"]')[0].value = captchaText;
		                    	document.querySelectorAll('form button[type="submit"]')[0].click();
		                    	return captchaText;
		                    }, captchaText, userId).then(function (message) {
		                    	callback();
		                    })
		        		})
	        		}, 1000);
	        	})
	        });
        }, 5000);
    });
}

function imageToText (imageName) {
    return new Promise(function (resolve, reject) {
        base64Img.base64(imageName, function(err, data) {
            request.post({url: 'https://api.ocr.space/parse/image', form: {
                    apikey: 'e88467850a88957',
                    isOverlayRequired: 'True',
                    base64Image: data
                }
            }, function (err, response, body) {
                if (!err) {
                    try {
                        var res = JSON.parse(body);
                        var text = res['ParsedResults'][0]['ParsedText'].replace(' \r\n', '');
                        resolve(text);
                    } catch (e) {
                        resolve(null);
                    }
                } else {
                    resolve(null);
                }
            })
        })
    })
}