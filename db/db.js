const mongoose 		   = require('mongoose');
const connectionString = 'mongodb://localhost/budget';
const mongoDbUri 	   = process.env.MONGO_URI || connectionString

mongoose.connect(mongoDbUri, {useNewUrlParser: true});

mongoose.connection.on('connected', () => {
	console.log('Mongoose connected at', connectionString);
});

mongoose.connection.on('diconnected', () => {
	console.log('Mongoose disconnected ');
});

mongoose.connection.on('error', (err) => {
	console.log('Mongoose error ', err);
})