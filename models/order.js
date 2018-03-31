const Sequelize = require('sequelize');
const sequilizeDb = require('../config/db');

const Order = sequilizeDb.define('order', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    paymentType: {
        type: Sequelize.STRING(100),
        allowNull: true,
        validate: {
            notEmpty: true
        }
    },
    status: {
        type: Sequelize.BOOLEAN,
        defaultValue: 0,
        allowNull: false,
        validate: {
            notEmpty: true
        }

    }

});

module.exports = Order;