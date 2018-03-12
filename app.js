require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const tool = require('./routes/tool');
const app = express();
// mongoose.Promise = global.Promise;
// mongoose.connect(process.env.MONGODB_URI);
// mongoose.connection.on('error', (err) => {
// 	console.error(err);
// 	console.log('%s MongoDB connection error. Please make sure MongoDB is running.', chalk.red('✗'));
// 	process.exit();
// });

app.set('views', __dirname + '/views');
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/tool', tool);

app.listen(process.env.PORT, process.env.HOST, function () {
    console.log('Server is running on port', process.env.PORT);
});