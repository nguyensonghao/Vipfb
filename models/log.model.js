const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
    token: String,
    userId: String,
    time: Date,
    captcha: String
}, {collection: 'logs'});

const Logs = mongoose.model('Log', logSchema);

module.exports = Logs;