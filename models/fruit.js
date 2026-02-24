//bring in mongoose
const mongoose = require('mongoose');

//set up model schema
const fruitSchema = new mongoose.Schema({
    //takes key value pairs
    name: String,
    isReadyToEat: Boolean,
    color: String,
    description: {
        type: String,
        minLength: 3,
        maxLength: 100,
    },
    isSoftDeleted: {
        type: Boolean,
        default: false,
    },
}, 
//timestamps true option adds createdAt and updatedAt properties to the record
{timestamps: true});

module.exports = mongoose.model('Fruit', fruitSchema);