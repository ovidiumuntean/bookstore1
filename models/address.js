const Sequelize = require('sequelize');
const sequilizeDb = require('../config/db')

const Address = sequilizeDb.define('address', {
    line1: {
        type: Sequelize.STRING(200),
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    line2: {
        type: Sequelize.STRING(200),
        allowNull: true,
        validate: {
            notEmpty: true
        }
    },
    city: {
        type: Sequelize.STRING(100),
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    postcode: {
        type: Sequelize.STRING(20),
        allowNull: true,
        validate: {
            notEmpty: true
        }
    },
    country: {
        type: Sequelize.STRING(100),
        allowNull: false,
        validate: {
            notEmpty: true
        }
    }
});

module.exports = Address;