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
                res.status(404).json({ message: 'No pizza found with this id.'});
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
};

module.exports = pizzaController;