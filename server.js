const express 		 = require('express');
const app 			 = express();
const PORT 			 = process.env.PORT;
const bodyParser 	 = require('body-parser');
const methodOverride = require('method-override')
const session 		 = require('express-session');
const cors 			 = require('cors');
require('dotenv').config({path:'./.env'})
require('es6-promise').polyfill();
require('isomorphic-fetch');

const User = require('./models/user');
const Budget = require('./models/budget')

const userController = require('./controllers/userController');
const budgetController = require('./controllers/budgetController');
const budgetItemsController = require('./controllers/budgetController')

require('./db/db')

app.use(session({
	secret: 'super secret string',
	resave: 'false',
	saveUninitialized: false
}));

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json())
app.use(methodOverride('_method'));
app.use(express.static('public'));

const corsOptions = {
	origin: process.env.HOST,
	credentials: true,
	optionsSuccessStatus: 200
}

app.use(cors(corsOptions))

app.use('/users', userController);
app.use('/budget', budgetController);
app.use('/items', budgetItemsController);





app.listen(9000, () => {
	console.log('Server is up and running!');
})