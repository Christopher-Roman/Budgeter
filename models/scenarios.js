const mongoose = require('mongoose');
const BudgetItems = require('./budgetItems')

const scenarioSchema = new mongoose.Schema({
	scenarioName: {
		type: String,
		require: true
	},
	created_at: {
		type: Date,
		default: Date.now
	},
	budgetItems: [BudgetItems.schema]
});

module.exports = mongoose.model('Scenario', scenarioSchema);