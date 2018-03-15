const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const request = require('request');
const async = require('async');
 
const url = 'mongodb://localhost:27017'; 
const dbName = 'vipfb';
const UtilHelper = require('../helpers/util.helper');

MongoClient.connect(url, function(err, client) {
  	assert.equal(null, err);
  	const db = client.db(dbName);
  	const TokenCollection = db.collection('tokens');
  	TokenCollection.find({}).toArray((err, list) => {
  		async.each(list, (item, callback) => {
  			UtilHelper.getInformationByToken(item.token).then(data => {
  				if (data) {
  					console.log("Token is valid!");
  					callback();
  				} else {
  					TokenCollection.remove({token: item.token}, (err) => {
  						console.log("Token is invalid!");
  						callback();
  					})
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