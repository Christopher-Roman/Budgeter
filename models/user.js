const mongoose = require('mongoose');
const Budget = require('./budget');
const BudgetItem = require('./budgetItems');
const Scenario = require('./scenarios');

const userSchema = new mongoose.Schema({
	username: {
		type: String,
		require: true,
		unique: true
	},
	password: {
		type: String,
		required: true
	},
	budget: [Budget.schema],
	budgetItem: [BudgetItem.schema],
	scenario: [Scenario.schema]
})

module.exports = mongoose.model('User', userSchema);