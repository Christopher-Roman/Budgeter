const express 	  = require('express');
const router 	  = express.Router();
const User 		  = require('../models/user');
const Budget 	  = require('../models/budget');
const Item  	  = require('../models/budgetItems');
const Scenario    = require('../models/scenarios');


//============================================================//
//															  //
//		These are the routes for Budget's specifically        //
//															  //
//============================================================//

// Budget Get All Route
router.get('/', async (req, res) => {
	if(req.session.logged) {
		const foundUser = await User.find({username: req.session.username})
		if(foundUser === undefined || foundUser === null){
			res.json({
				status: 204,
				data: 'No budgets have been created'
			})
		} else {
			res.json({
				status: 200,
				data: foundUser
			})
		}
	}
})

router.get('/:id', async (req, res) => {
	if(req.session.logged) {
		const noBudget = 'There is no budget under that ID'
		const foundBudget = await Budget.findById(req.params.id);
		if(!foundBudget) {
			res.json({
				status: 204,
				data: noBudget
			})
		} else {
			res.json({
				status: 200,
				data: foundBudget
			})
		}
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
				status: 400,
				data: err
			})
		}
	} else {
		const forbidden = 'You must be logged in to perform this action.'
		console.log('hit the else statement 403 status');
		res.json({
			status: 403,
			data: forbidden
		}) 
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
router.delete('/delete/:id', async (req, res) => {
	try {
		const currentUser = await User.findOne({username: req.session.username})
		console.log(currentUser);
		console.log('=== Before Splice ===');
		currentUser.budget.splice(currentUser.budget.findIndex((budget) => {
			return budget._id === req.params.id
		}), 1)
		console.log(currentUser);
		console.log('=== After Splice ===');
		await currentUser.save()
		const foundBudget = await Budget.findById(req.params.id)
		console.log(foundBudget);
		console.log('=== Before Delete ===');
		let deletedItemIds = []
		for(let i = 0; i < foundBudget.budgetItem.length; i++) {
			deletedItemIds.push(foundBudget.budgetItem[i].id)
		}
		console.log(deletedItems);
		console.log('=== Deleted Items ===');
		const deletedBudget = await Budget.findByIdAndDelete(req.params.id)
		const deletedItems = await Item.deleteMany({
			_id: {$in: deletedItemIds}
		})
		await currentUser.save()
		res.json({
			status: 200
		})
	} catch(err) {
		res.send(err)
	}
})

//============================================================//
//															  //
//    These are the routes for Budget Items specifically      //
//															  //
//============================================================//

// Budget Item's Get Route
router.get('/:id/item/:index', async (req, res) => {
	if(req.session.logged) {
		try {
			const foundBudgetItem = await Item.findById(req.params.index)
			res.json({
				status: 200,
				data: foundBudgetItem
			})
		} catch(err) {
			res.send(err)
		}
	} else {
		req.session.message = 'You must be logged in to view this page.'
	}
	res.json()
})

// Budget Item's Post Route

router.post('/:id/item/new', async (req, res) => {
	if(req.session.logged) {
		try {
			const foundBudget = await Budget.findById(req.params.id);
			const itemToAdd = {
				itemName: req.body.itemName,
				amount: req.body.amount
			}
			const newBudgetItem = await Item.create(itemToAdd);
			foundBudget.budgetItem.push(newBudgetItem);
			foundBudget.save()
			res.json({
				status: 200,
				data: foundBudget
			})
		} catch(err) {
			res.json({
				status: 204,
				data: err
			})
		}
	} else {
		req.session.message = 'You must be logged in to perform this action.'
	}
})

// Budget Item's Put Route

router.put('/:id/item/:index', async (req, res, next) => {
	try {
		const updatedItem = {
			_id: req.params.index,
			itemName: req.body.itemName,
			amount: req.body.amount
		}
		const itemToUpdate = await Item.findByIdAndUpdate(req.params.index, updatedItem, {new: true});
		itemToUpdate.save();
		const foundBudget = await Budget.findById(req.params.id);
		foundBudget.budgetItem.splice(foundBudget.budgetItem.findIndex((item) => {
			return item.id === itemToUpdate.id
		}), 1, itemToUpdate)
		foundBudget.save();
		res.json({
			status: 200,
			data: foundBudget
		})
	} catch(err) {
		res.send(err)
	}
})

// Budget Item's Delete Route

router.delete('/:id/item/:index', async (req, res, next) => {
	try {
		const deletedItem = await Item.findByIdAndRemove(req.params.index);
		const currentBudget = await Budget.findById(req.params.id);
		currentBudget.budgetItem.splice(currentBudget.budgetItem.findIndex((item) => {
			return item.id === deletedItem.id
		}), 1)
		currentBudget.save()
		res.json({
			status: 200,
			data: currentBudget
		})
	} catch(err) {
		res.send(err)
	}
})


//============================================================//
//															  //
//    These will be the routes for Scenarios specifically     //
//															  //
//============================================================//

module.exports = router;