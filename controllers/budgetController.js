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

// Budget Put Route
router.put('/:id', async (req, res) => {
	const budgetModel = await Budget.findOne({_id: req.params.id})
	const updatedBudget = {
		_id: req.params.id,
		budgetName: req.body.budgetName,
		created_at: Date.now,
		netMonthlyIncome: req.body.netMonthlyIncome
		budgetItem: [],
		scenario: []
	}
	for(let i = 0; i < budgetModel.budgetItem.length; i++) {
		updatedBudget.budgetItem.push(budgetModel.budgetItem[i])
	}
	for(let i = 0; i < budgetModel.scenario.length; i++) {
		updatedBudget.scenario.push(budgetModel.scenario[i])
	}
	const updatedBudget = await Budget.findByIdAndUpdate(req.params.id, updatedBudget, {new: true});
	updatedBudget.save()
	res.json({
		status: 200,
		data: updatedBudget
	})
})

// Budget Delete Route
router.delete('/:id', async (req, res) => {
	try {
		const foundUser = await User.findOne({username: req.session.username})
		const deletedBudget = await Budget.findOneAndRemove({_id: req.params.id});
		foundUser.budget.splice(foundUser.budget.findIndex((budget) => {
			return budget.id === deletedBudget.id
		}), 1)
		let deletedBudgetItemsIds = [];
		for(let i = 0; i < deletedBudget.budgetItem.length; i++){
			deletedBudgetItemsIds.push(deletedBudget.budgetItem[i].id)
		}
		const deletedBudgetItems = await BudgetItems.deleteMany({
			_id: {$in: deletedBudgetItemsIds}
		})
		res.json({
			status: 200,
			data: foundUser
		})
	} catch(err) {
		res.send(err)
	}
})

module.exports = router;