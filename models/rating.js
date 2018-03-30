const Sequelize = require('sequelize');
const sequilizeDb = require('../config/db');

const Rating = sequilizeDb.define('rating', {
    rating: {
        type: Sequelize.FLOAT(1, 1),
        allowNull: false,
        validate: {
            notEmpty: true,
            isFloat: true,
            max: 5,
            min: 0
        }

    },
    review: {
        type: Sequelize.STRING(400),
        allowNull: true,
        validate: {
            notEmpty: true
        }
    },
});

module.exports = Rating;