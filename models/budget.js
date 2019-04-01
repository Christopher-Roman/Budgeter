const mongoose = require('mongoose');
const BudgetItems = require('./budgetItems')

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
	budgetItem: [BudgetItem.schema],
	scenario: [Scenario.schema]
});


module.exports = mongoose.model('Budget', budgetSchema)