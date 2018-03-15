var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var phantom = require('phantom');
var base64Img = require('base64-img');
var request = require('request');
var moment = require('moment');
var async = require('async');

var url = "https://fanpage.vipfb.co";
var urlRequest = "https://fanpage.vipfb.co/fanpage.php?type=myPageCustom";
var urlMongo = 'mongodb://localhost:27017'; 
var dbName = 'vipfb';
var UtilHelper = require('../helpers/util.helper');

MongoClient.connect(urlMongo, function(err, client) {
    assert.equal(null, err);
    const db = client.db(dbName);
    const TokenCollection = db.collection('tokens');
    TokenCollection.find({}).toArray((err, list) => {
        async.each(list, (item, callback) => {
            UtilHelper.getInformationByToken(item.token).then(data => {
                if (data) {
                    loginVipFb(item.token, '1993613924220223').then(function (data) {
                        if (data) {
                            if (data) {
                                console.log("Like fanpage successfully!");
                            } else {
                                console.log("Have an error when like fanpage!");
                            }

                            callback();
                        } else {

                        }
                    })
                } else {
                    callback();
                }
            })
        }, (err) => {
            if (err) {
                console.log("Have an error!");
                console.log(err);
                client.close();
            } else {
                console.log("End process!");
                client.close();
            }
        })
    })
});


function loginVipFb (token, fanpageId) {
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
            try {
                setTimeout(function () {
                    _page.evaluate(function(token) {
                        document.querySelectorAll('#LoginD input[type="text"]')[0].value = token;
                        document.querySelectorAll('#LoginD button[type="submit"]')[0].click();
                        return 0;
                    }, token);

                    setTimeout(function () {
                        sendRequest(_page, fanpageId, function () {
                            setTimeout(function () {
                                _page.close();
                                _ph.exit();
                                resolve(true);
                            }, 2000);
                        })
                    }, 5000);
                }, 5000);
            } catch (e) {
                _page.close();
                _ph.exit();
                resolve(false);
            }
        }).catch(() => {
            _page.close();
            _ph.exit();
            resolve(false);
        });
    })
}

function sendRequest (page, fanpageId, callback) {
	page.property('viewportSize', {width: 900, height: 600}).then(function() {
        return page.open(urlRequest);
    }).then(function () {
        setTimeout(function () {
        	try {
        		page.evaluate(function(fanpageId) {
		        	document.querySelectorAll('form.autolike input[type="text"]')[0].value = fanpageId;
		        	// document.querySelectorAll('form.autolike button[type="submit"]')[0].click();
		        	return fanpageId;
		        }, fanpageId).then(function (result) {
                    console.log(result);
		        	callback();
		        });
        	} catch (e) {
        		console.log(e);
        	}
        }, 5000);
    });
}