var phantom = require('phantom');
var base64Img = require('base64-img');
var request = require('request');

var urlRequest = "https://vipfb.in/request_panel.php";
var url = "https://vipfb.in";

module.exports = {
	showAddFriend: function (req, res) {
		res.render('addFriends');
	},

	addFriend: function (req, res) {
		var token = req.body.token;
		var userId = req.body.userId;
		return new Promise(function (resolve, reject) {
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
			            	setTimeout(function () {
			            		_page.close();
					    		_ph.exit();
					    		resolve({status: true});
			            	}, 1000);
			            })
			        }, 5000);
				}, 5000);
			}).catch(() => {
			    _page.close();
			    _ph.exit();
			    resolve({status: false});
			});
		})
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
	        				page.property('clipRect', {
		        				top:    0,
					            left:   0,
					            width:  1000,
					            height: 1200
					        }).then(function () {
					        	var captchaText = key;
					        	console.log(captchaText);
					        	page.evaluate(function (captchaText) {
			                    	document.querySelectorAll('form input[name="id"]')[0].value = userId;
			                    	document.querySelectorAll('form input[name="captchaBox"]')[0].value = captchaText;
			                    	document.querySelectorAll('form button[type="submit"]')[0].click();
			                    	return captchaText;
			                    }, captchaText).then(function (message) {
			                    	console.log(message);
			                    	page.render('test.png');
			                    	callback();
			                    })
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