const express 	  = require('express');
const router 	  = express.Router();
const User 		  = require('../models/user');
const Budget 	  = require('../models/budget');
const BudgetItems = require('../models/budgetItems');

// Budget Get Route
router.get('/:id', async (req, res) => {
	if(req.session.logged) {
		const budgetView = await Budget.findById(req.params.id)
		res.json({
			status: 200,
			data: budgetView
		})
	}
})

// Budget Post Route
router.post('/new', async (req, res) => {
	if(req.session.logged) {
		try {
			const budgetEntry = {}
			budgetEntry.budgetName = req.body.budgetName
			budgetEntry.netMonthlyIncome = req.body.netMonthlyIncome
			budgetEntry.budgetItem = []
			budgetEntry.scenario = []
			
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
router.put('/:id/update', async (req, res) => {
	if(req.session.logged) {
		try {
			const budgetModel = await Budget.findOne({_id: req.params.id})
			const newBudget = {
				_id: req.params.id,
				budgetName: req.body.budgetName,
				netMonthlyIncome: req.body.netMonthlyIncome,
				budgetItem: [],
				scenario: []
			}
			for(let i = 0; i < budgetModel.budgetItem.length; i++) {
				newBudget.budgetItem.push(budgetModel.budgetItem[i])
			}
			for(let i = 0; i < budgetModel.scenario.length; i++) {
				newBudget.scenario.push(budgetModel.scenario[i])
			}
			const updatedBudget = await Budget.findOneAndUpdate(req.params.id, newBudget, {new: true});
			updatedBudget.save()
			const currentUser = await User.findOne({username: req.session.username});
			console.log(currentUser);
			currentUser.budget.splice(currentUser.budget.findIndex((budget) => {
				return budget.id === budgetModel.id;
			}),1,newBudget);
			currentUser.save()
			res.json({
				status: 200,
				data: updatedBudget
			})
		} catch(err) {
			console.log(err);
		}
	} 
})

// Budget Delete Route
router.delete('/:id/delete', async (req, res) => {
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