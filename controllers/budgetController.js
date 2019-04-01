const express 	  = require('express');
const router 	  = express.Router();
const User 		  = require('../models/user');
const Budget 	  = require('../models/budget');
const BudgetItems = require('../models/budgetItems');

// Budget Post Route
router.post('/new', async (req, res) => {
	if(req.session.logged) {
		try {
			const budgetEntry = {}
			budgetEntry.budgetName = req.body.budgetName
			budgetEntry.budgetItem = []
			
			const newBudget = await Budget.create(budgetEntry)
			const foundUser = await User.findOne({username: req.session.username});
			foundUser.budget.push(newBudget);
			foundUser.save()
			res.json({
				status: 200,
				data: newBudget
			})
		} catch(err) {
			res.json({
				status: 200,
				data: err
			})
		}
	} else {
		req.session.message = 'You must be logged in to create a new budget.'
	}
})

// Budget Delete Route
router.delete('/:id', async (req, res) => {
	try {
		const foundUser = await User.findOne({username: req.session.username})
		console.log(foundUser, ' First console log of user');
		console.log(req.params.id, ' These are the params');
		const deletedBudget = await Budget.findOneAndRemove({_id: req.params.id});
		console.log(deletedBudget, ' Deleted budget console log');
		foundUser.budget.splice(foundUser.budget.findIndex((budget) => {
			return budget.id === deletedBudget.id
		}), 1)
		// let deletedBudgetItemsIds = [];
		// for(let i = 0; i < deletedBudget.budgetItem.length; i++){
		// 	deletedBudgetItemsIds.push(deletedBudget.budgetItem[i].id)
		// }
		// const deletedBudgetItems = await BudgetItems.deleteMany({
		// 	_id: {$in: deletedBudgetItemsIds}
		// })
		console.log(foundUser, ' Second console log of user');
		res.json({
			status: 200,
			data: foundUser
		})
	} catch(err) {
		res.send(err)
	}
})

module.exports = router;