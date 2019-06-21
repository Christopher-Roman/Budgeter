const express 		 = require('express');
const app 			 = express();
const PORT 			 = process.env.PORT;
const bodyParser 	 = require('body-parser');
const methodOverride = require('method-override')
const session 		 = require('express-session');
const cors 			 = require('cors');
require('dotenv').config({path:'./.env'}) // Housing for sensitive information
require('es6-promise').polyfill(); // Used in conjunction with isomorphic fetch
require('isomorphic-fetch'); // May need for 3rd party API calls. Used in lieu of superagent


// Requiring models for use in Routes
const User = require('./models/user');
const Budget = require('./models/budget')

// Declaring controllers for each model
const userController = require('./controllers/userController');
const budgetController = require('./controllers/budgetController');
const budgetItemsController = require('./controllers/budgetController')

// Requiring the Database
require('./db/db')


// Configuring sessions
app.use(session({
	secret: process.env.SECRET,
	resave: 'false',
	saveUninitialized: false
}));


// Requiring middleware for communication between front
// and back end.

app.use(bodyParser.urlencoded({extended: false})); //Body Parser to collect form data
app.use(bodyParser.json())	//Body Parser to collect form data from JSON response
app.use(methodOverride('_method')); // Method Override used to allow Delete and Put routes
app.use(express.static('public'));  //Added just in case, but will more than likely not be used.


// Configuring CORS Options
const corsOptions = {
	origin: process.env.HOST,
	credentials: true,
	optionsSuccessStatus: 200
}

// Applying CORS configuration to the app
app.use(cors(corsOptions))


// Creating endpoints for each controller
app.use('/users', userController);
app.use('/budget', budgetController);


// Declaring the connection port for the app.
app.listen(process.env.PORT, () => {
	console.log('Server is up and running!');
})