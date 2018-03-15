var request = require('request');

module.exports = {
	getInformationByToken: function (token) {
		return new Promise(function (resolve, reject) {
			var url = "https://graph.facebook.com/me?access_token=" + token;
			request.get(url, function (err, response, body) {
				if (err) {
					resolve(null);
				} else {
					var data = JSON.parse(body);
					if (data && data.id) {
						resolve(data);
					} else {
						resolve(null);
					}
				}
			})
		})
	}
}