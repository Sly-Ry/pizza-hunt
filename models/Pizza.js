const { Schema, model } = require('mongoose');

// We don't have to define the fields, as MongoDB will allow the data anyway, but for for clarity and usability, we should regulate what the data will look like.
const PizzaSchema = new Schema(
    {
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
            default: Date.now,
        },
        size: {
            type: String,
            default: 'Large'
        },
        // This indicates an array as the data type. You could also specify 'Array' in place of the brackets
        toppings: [],
        // We need to tell Mongoose to expect an ObjectId and to tell it that its data comes from the Comment model. 
        comments: [
            {
                type: Schema.Types.ObjectId,
                // The ref property is especially important because it tells the Pizza model which documents to search to find the right comments.
                ref: 'Comment'
            }
        ]
    },
    {
        toJSON: {
            virtuals: true,
        },
        // We set id to false because this is a virtual that Mongoose returns, and we don’t need it.
        id: false
    }
);

// get total count of comments and replies on retrieval
PizzaSchema.virtual('commentCount').get(function() {
    return this.comments.length;
});

// Pizza model using PizzaSchema
const Pizza = model('Pizza', PizzaSchema);

module.exports = Pizza;