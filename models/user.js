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
	netMonthlyIncome: {
		type: Number,
		required: true
	},
	budget: [Budget.schema]
})

module.exports = mongoose.model('User', userSchema);