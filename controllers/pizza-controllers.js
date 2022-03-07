const { process_params } = require('express/lib/router');
const { Pizza } = require('../models');

const pizzaController = {
    // Get all pizzas
    getAllPizza(req, res) {
        // Mongoose .find() method works much like the Sequelize .findAll() method.
        Pizza.find({})
        .then(dbPizzaData => res.json(dbPizzaData))
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        });
    },

    // Get one pizza by id
    getPizzaById(req, res) {
        Pizza.findOne({ _id: params.id })
        .then(dbPizzaData => {
            // if no pizza is found, send 404
            if (!dbPizzaData) {
                res.status(404).json({ message: 'No pizza found with this id, ya jerk!'});
                return;
            }
            res.json(dbPizzaData);
        })
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        });
    },

    // createPizza
    createPizza({ body }, res) {
        // In MongoDB, the methods for adding data to a collection are .insertOne() or .insertMany(). But in Mongoose, we use the .create() method, which will actually handle either one or multiple inserts!
        Pizza.create(body)
        .then(dbPizzaData => res.json(dbPizzaData))
        .catch(err => res.status(400).json(err));
    },

    // update pizza by id
    updatePizza({ params, body }, res) {
        // With this .findOneAndUpdate() method, Mongoose finds a single document we want to update, then updates it and returns the updated document.
        //  If we don't set that third parameter, { new: true }, it will return the original document.
        // By setting the parameter to true, we're instructing Mongoose to return the new version of the document.
        Pizza.findOneAndUpdate({ _id: params.id }, body, { new: true })
        .then(dbPizzaData => {
            if(!dbPizzaData) {
                res.status(404).json({ message: 'No pizza found with this id, ya freak!'});
                return;
            }
            res.json(dbPizzaData);
        })
        .catch(err => res.status(400).json(err));
    },

    // delete pizza
    deletePizza({ params }, res) {
        // Like with updating, we could alternatively use .deleteOne() or .deleteMany(), but we're using the .findOneAndDelete() method because it provides a little more data in case the client wants it.
        Pizza.findOneAndDelete({ _id: params.id })
        .then(dbPizzaData => {
            if(!dbPizzaData) {
                res.status(404).json({ message: 'No pizza found with this id, ya dork!'});
                return;
            }
            res.json(dbPizzaData);
        })
        .catch(err => res.status(400).json(err));
    }
};

module.exports = pizzaController;