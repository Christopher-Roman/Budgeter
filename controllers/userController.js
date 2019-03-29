const express = require('express');
const router = express.Router();
const User = require('../models/user');
const bcrypt = require('bcrypt')
// Register Post Route

router.post('/register', async (req, res) => {
		const password = req.body.password;
		const passwordHash = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
		console.log(passwordHash);
		const userEntry = {};
		userEntry.username = req.body.username;
		userEntry.password = passwordHash;
		const user = await User.create(userEntry);
		console.log(user);
		req.session.username = req.body.username;
		req.session.logged = true;
		req.session.message = undefined;
		res.redirect('/');
})


module.exports = router;