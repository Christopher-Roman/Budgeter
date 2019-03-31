const express 	  = require('express');
const router 	  = express.Router();
const User 		  = require('../models/user');
const Budget 	  = require('../models/budget');
const BudgetItems = require('../models/budgetItems');

// Budget Delete Route
router.delete('/:index', async (req, res) => {
	try {
		const deletedBudget = await Budget.findByIdAndDelete(req.params.index);
		let deletedBudgetItemsIds = [];
		for(let i = 0; i < deletedBudget.budgetItem.length; i++){
			deletedBudgetItemsIds.push(deletedBudget.budgetItem[i].id)
		}
		const deletedBudgetItems = await BudgetItems.deleteMany({
			_id: {$in: deletedBudgetItemsIds}
		})
		res.json({
			status: 200,
			data: deletedBudget
		})
	} catch(err) {
		res.send(err)
	}
})

// New Budget Route

router.post('/budget', async (req, res) => {
	if(req.session.logged) {
		try {
			const newBudget = await Budget.create(req.body);
			res.json({
				status: 200,
				data: newBudget
			})
		} catch(err) {
			res.send(err)
		}
	} else {
		req.session.message = 'You must be logged in to create a new budget.'
	}
})