const mongoose = require('mongoose');

const RateSchema = new mongoose.Schema({
    FromType: {
        type: String,
        required: true,
    },
    ToType: {
        type: String,
        required: true
    },
    RateValue: {
        type: Number,
        required: true
    }
    
})

module.exports = mongoose.model('Rate', RateSchema)