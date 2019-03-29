const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const bodyParser = require('body-parser');
const methodOverride = require('method-override')
const session = require('express-session');

const User = require('./models/user');

const userController = require('./controllers/userController');

require('./db/db')

app.use(session({
	secret: 'super secret string',
	resave: 'false',
	saveUninitialized: false
}));

app.use(bodyParser.urlencoded({extended: false}));
app.use(methodOverride('_method'));
app.use(express.static('public'));

app.use('/users', userController);





app.listen(PORT, () => {
	console.log('Server is listening on port ' + PORT);
})