const express = require('express');
const router = express.Router();
const User = require('../models/user');
const bcrypt = require('bcrypt')


// Register Post Route
router.post('/register', async (req, res) => {
	const password = req.body.password;
	const passwordHash = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
	const userEntry = {};
	userEntry.username = req.body.username;
	userEntry.password = passwordHash;
	const user = await User.create(userEntry);
	req.session.username = req.body.username;
	req.session.logged = true;
	req.session.message = undefined;
	res.redirect('/');
});

// Login Post Route
router.post('/login', async (req, res) => {
	try {
		const foundUser = await User.findOne({username: req.body.username});
		if(foundUser) {
			if(bcrypt.compareSync(req.body.password, foundUser.password)) {
				req.session.username = req.body.username;
				req.session.logged = true;
				req.session.message = undefined;
				res.redirect('/');
			} else {
				req.session.message = 'Username or password are incorrect.'
				res.redirect('/users/login')
			}
		} else {
			req.session.message = 'Username or password are incorrect.'
			res.redirect('/users/login')
		}
	} catch(err) {
		res.send(err);
	}
})

// Logout Route
router.get('/logout', (req, res) => {
	req.session.destroy((err) => {
		if(err) {
			res.send(err);
		} else {
			console.log('Logout successful');
			res.redirect('/')
		}
	})
})


module.exports = router;