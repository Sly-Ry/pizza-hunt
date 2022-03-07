const { Comment, Pizza } = require('../models');

const commentController = {
    // add comment to pizza
    addComment({ params, body }, res) {
        console.log(body);
        Comment.create(body)
        .then(({ _id }) => {
            return Pizza.findOneAndUpdate(
                { _id: params.pizzaId },
                // The $push method works just the same way that it works in JavaScript—it adds data to an array. 
                { $push: { comments: _id } },
                // Because we passed the option of new: true, we're receiving back the updated pizza (the pizza with the new comment included).
                { new: true }
            );
        })
        .then(dbPizzaData => {
            if (!dbPizzaData) {
                res.status(404).json({ message: 'No pizza found with this id!' });
                return;
            }
            res.json(dbPizzaData);
        })
        .catch(err => res.json(err));
    },
    
    // remove comment
    removeComment({ params }, res) {
        Comment.findOneAndDelete({ _id: params.commentId })
        .then(deletedComment => {
            if (!deletedComment) {
                return res.status(404).json({ message: 'No comment with this id, ya nerd!' });
            }
            return Pizza.findOneAndUpdate(
                { _id: params.pizzaId },
                // We take the data and use it to identify and remove it from the associated pizza using the Mongo $pull operation.
                { $pull: { comments: params.commentId } },
                { new: true }
            );
        })
        .then(dbPizzaData => {
            if (!dbPizzaData) {
                res.status(404).json({ message: 'No pizza found with this id, ya gerbil!' });
                return;
            }
            res.json(dbPizzaData);
        })
        .catch(err => res.json(err));
    }
};

module.exports = commentController;