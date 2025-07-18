const mongoose = require('mongoose');

const CurrencySchema = new mongoose.Schema({
    Code: {
        type: String,
        required: true,
    },
    Name: {
        type: String,
        required: true
    },
})

module.exports = mongoose.model('Currency', CurrencySchema)