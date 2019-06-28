const mongoose = require('mongoose');
const Budget = require('./budget');
const BudgetItems = require('./budgetItems');
const Scenarios = require('./scenarios');

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
	budget: [Budget.schema]
})

module.exports = mongoose.model('User', userSchema);