const mongoose = require('mongoose');
const BudgetItems = require('../models/budgetItems')
const Scenario = require('../models/scenarios')

const budgetSchema = new mongoose.Schema({
	budgetName: {
		type: String,
		require: true
	},
	created_at: {
		type: Date,
		default: Date.now
	},
	netMonthlyIncome: Number,
	budgetItem: [BudgetItems.schema],
	scenario: [Scenario.schema]
});


module.exports = mongoose.model('Budget', budgetSchema)