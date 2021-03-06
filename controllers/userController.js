const express 		= require('express');
const router 		= express.Router();
const User 			= require('../models/user');
const Budget 		= require('../models/budget');
const BudgetItems 	= require('../models/budgetItems');
const Scenarios 	= require('../models/scenarios');
const bcrypt 		= require('bcrypt')

//=======================================================//
//													     //
//		These are the routes for User specifically       //
//														 //
//=======================================================//

// Register Post Route
router.post('/register', async (req, res) => {
	try {
		const password = req.body.password;
		const passwordHash = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
		const userEntry = {};
		userEntry.username = req.body.username;
		userEntry.password = passwordHash;
		const user = await User.create(userEntry);
		req.session.username = req.body.username;
		req.session.logged = true;
		req.session.message = undefined;
		res.json({
			status: 200,
			data: user
		});
	} catch(err) {
		res.send(err)
	}
});

// Login Post Route
router.post('/login', async (req, res, next) => {
	try {
		const foundUser = await User.findOne({username: req.body.username});
		if(foundUser) {
			if(bcrypt.compareSync(req.body.password, foundUser.password)) {
				req.session.username = req.body.username;
				req.session.logged = true;
				req.session.message = undefined;
				res.json({
					status: 200,
					data: foundUser
				})
			} else {
				req.session.message = 'Username or password are incorrect.'
				res.json({
					status: 401,
					data: 'Login failed. Username or password were incorrect'
				})
			}
		} else {
			req.session.message = 'Username or password are incorrect.'
			res.json({
					status: 400,
					data: 'Login failed. Username or password were incorrect'
				})
		}
	} catch(err) {
		next(err);
	}
})

// Logout Route
router.get('/logout', (req, res) => {
	req.session.destroy((err) => {
		if(err) {
			res.send(err);
		} else {
			res.json({
				status: 200,
				data: 'Logout Successful'
			})
		}
	})
})

// User Delete Route
router.delete('/delete', async (req, res) => {
	try {
		const deletedUser = await User.findOneAndDelete({username: req.session.username});
		let deletedBudgetsIds = [];
		for(let i = 0; i < deletedUser.budget.length; i++) {
			deletedBudgetsIds.push(deletedUser.budget[i].id);
		}
		let deletedScenariosIds = [];
		for(let i = 0; i < deletedUser.scenario.length; i++){
			deletedScenariosIds.push(deletedUser.scenario[i].id)
		}
		let deletedBudgetItemsIds = [];
		for(let i = 0; i < deletedUser.budgetItem.length; i++) {
			deletedBudgetItemsIds.push(deletedUser.budgetItem[i].id)
		}
		const deletedBudgets = await Budget.deleteMany({
			_id: {$in: deletedBudgetsIds}
		})
		const deletedScenarios = await Scenarios.deleteMany({
			_id: {$in: deletedScenariosIds}
		})
		const deletedBudgetItems = await BudgetItems.deleteMany({
			_id: {$in: deletedBudgetItemsIds}
		})
		res.json({
			status: 200,
			data: deletedUser
		})
	} catch(err) {
		res.send(err)
	}
})


module.exports = router;