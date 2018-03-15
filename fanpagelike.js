var phantom = require('phantom');
var base64Img = require('base64-img');
var request = require('request');
var moment = require('moment');

var url = "https://fanpage.vipfb.co";
var urlRequest = "https://fanpage.vipfb.co/fanpage.php?type=myPageCustom";

var _ph, _page;
var token = "EAAAAUaZA8jlABABJp3UFdEEsUfwJYnU9OhmAsovpYmyDKARd2KYEtAVL6tdoZCnsmZAXXBDDNPyLVZAWoGRFcThZAkdB7tVfmPZCWNQBz4uXHZCS1h8C9YAFatQCDNra2OXU92lx3wUCYS0dUVxVoJZCoOY2B033oKcregVMRVoR1ukNQpMvUgvMHP89eaIEb3Rm8M9lyFhUvupx9KZBgiumJ";
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
    		sendRequest(_page, "1993613924220223", function () {
    			setTimeout(function () {
    				console.log("End Process!");
    				_page.close();
		    		_ph.exit();
    			}, 2000);
    		})
		}, 5000);
	}, 5000);
}).catch(() => {
    _page.close();
    _ph.exit();
});

function sendRequest (page, fanpageId, callback) {
	page.property('viewportSize', {width: 900, height: 600}).then(function() {
        return page.open(urlRequest);
    }).then(function () {
        setTimeout(function () {
        	try {
        		page.evaluate(function(fanpageId) {
		        	document.querySelectorAll('form.autolike input[type="text"]')[0].value = fanpageId;
		        	document.querySelectorAll('form.autolike button[type="submit"]')[0].click();
		        	return 0;
		        }, fanpageId).then(function (result) {
		        	callback();
		        });
        	} catch (e) {
        		console.log(e);
        	}
        }, 5000);
    });
}