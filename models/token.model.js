const mongoose = require('mongoose');

const tokenSchema = new mongoose.Schema({
    token: String,
    information: Object,
    create_at: Date,
    active: Boolean,
   	lastUse: Date
}, {collection: 'tokens'});

const Tokens = mongoose.model('Token', tokenSchema);

module.exports = Tokens;