const mongoose = require('mongoose');

const budgetItemsSchema = new mongoose.Schema({
	itemName: {
		type: String,
		required: true
	},
	amount: {
		type: Number,
		required: true
	}
})

module.exports = mongoose.model('Budget-Items', budgetItemsSchema);