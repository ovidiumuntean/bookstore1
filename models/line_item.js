const Sequelize = require('sequelize');
const sequilizeDb = require('../config/db');

const LineItem = sequilizeDb.define('lineItem', {
    sale_price: {
        type: Sequelize.FLOAT(4, 2),
        allowNull: false,
        validate: {
            notEmpty: true,
            isFloat: true
        }

    },
    quantity: {
        type: Sequelize.INTEGER,
        allowNull: false,
        validate: {
            notEmpty: true,
            isInt: true
        }
    }
});

module.exports = LineItem;