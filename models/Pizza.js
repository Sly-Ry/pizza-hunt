const { Schema, model } = require('mongoose');

// We don't have to define the fields, as MongoDB will allow the data anyway, but for for clarity and usability, we should regulate what the data will look like.
const PizzaSchema = new Schema({
    // Using MongoDB and Mongoose, we simply instruct the schema that this data will adhere to the built-in JavaScript data types, including strings, Booleans, numbers, and so on.
    pizzaName: {
        type: String
    },
    createdBy: {
        type: String
    },
   
    createdAt: {
        type: Date, 
        // If no value is provided in this field when the user creates new data, the Date.now function will be executed and will provide a timestamp. This way we don't have to create the timestamp elsewhere and send that data.
        default: Date.now
    },
    size: {
        type: String,
        default: 'Large'
    },
    // This indicates an array as the data type. You could also specify 'Array' in place of the brackets
    toppings: []
});

// Pizza model using PizzaSchema
const Pizza = model('Pizza', PizzaSchema);

module.exports = Pizza;