const mongoose = require('mongoose');
const BudgetItems = require('./budgetItems')
const Scenario = require('./scenarios')

const budgetSchema = new mongoose.Schema({
	budgetName: {
		type: String,
		require: true
	},
	created_at: {
		type: Date,
		default: Date.now
	},
	netMonthlyIncome: {
		type: Number,
		required: true
	},
	budgetItem: [BudgetItems.schema],
	scenario: [Scenario.schema]
});


module.exports = mongoose.model('Budget', budgetSchema)