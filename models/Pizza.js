const { Schema, model } = require('mongoose');
const dateFormat = require('../utils/dateFormat');

// We don't have to define the fields, as MongoDB will allow the data anyway, but for for clarity and usability, we should regulate what the data will look like.
const PizzaSchema = new Schema(
    {
        // Using MongoDB and Mongoose, we simply instruct the schema that this data will adhere to the built-in JavaScript data types, including strings, Booleans, numbers, and so on.
        pizzaName: {
            type: String,
            required: 'Give yer pizza a damn name!',
            trim: true
        },
        createdBy: {
            type: String,
            required: 'Who the hell are ye, buck-a-roo?!',
            trim: true
        },
        createdAt: {
            type: Date, 
            // If no value is provided in this field when the user creates new data, the Date.now function will be executed and will provide a timestamp. This way we don't have to create the timestamp elsewhere and send that data.
            default: Date.now,
            // With the 'get' option in place, every time we retrieve a pizza, the value in the createdAt field will be formatted by the dateFormat() function and used instead of the default timestamp value. This way, we can use the timestamp value for storage, but use a prettier version of it for display.
            get: (createdAtVal) => dateFormat(createdAtVal)
        },
        size: {
            type: String,
            required: true,
            // the enum option stands for enumerable, a popular term in web development that refers to a set of data that can be iterated over—
            // If you want to provide a custom message for enumerable values, you need to look into implementing the validate option Mongoose lets you use, where you can create a custom function to test the values, just like you did with Inquirer!
            enum: ['Personal', 'Small', 'Medium', 'Large'],
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
            getters: true
        },
        // We set id to false because this is a virtual that Mongoose returns, and we don’t need it.
        id: false
    }
);

// get total count of comments and replies on retrieval
PizzaSchema.virtual('commentCount').get(function() {
    // The built-in .reduce() method is great for calculating a value based off of the accumulation of values in an array.
    // Here we're using the .reduce() method to tally up the total of every comment with its replies. In its basic form, .reduce() takes two parameters, an accumulator and a currentValue.
    // Here, the accumulator is "total", and the currentValue is "comment".
    return this.comments.reduce((total, comment) => total + comment.replies.length + 1, 0);

    // Like .map(), the array prototype method .reduce() executes a function on each element in an array. However, unlike .map(), it uses the result of each function execution for each successive computation as it goes through the array. [this makes it a perfect candidate for getting a sum of multiple values]
});

// Pizza model using PizzaSchema
const Pizza = model('Pizza', PizzaSchema);

module.exports = Pizza;