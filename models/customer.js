const Sequelize = require('sequelize');
const sequilizeDb = require('../config/db');

const Customer = sequilizeDb.define('customer', {
    first_name: {
        type: Sequelize.STRING(200),
        allowNull: false,
        validate: {
            notEmpty: true,
            is: ["^[a-z]+$",'i']
        }
    },
    last_name: {
        type: Sequelize.STRING(200),
        allowNull: false,
        validate: {
            notEmpty: true,
            is: ["^[a-z]+$",'i']
        }
    },
    permission: {
        type: Sequelize.ENUM('customer'),
        defaultValue: 'customer',
        validate: {
            notEmpty: true
        }
    },
    loyalty_discount: {
        type: Sequelize.FLOAT(2, 2),
        defaultValue: 0,
        allowNull: true,
        validate: {
            notEmpty: true,
            isFloat: true
        }

    },
    email: {
        type: Sequelize.STRING(200),
        allowNull: false,
        unique: true,
        validate: {
            notEmpty: true,
            isEmail: true
        }

    },
    password: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
}, {
    getterMethods: {
        // `this` refers to the instance
        fullName: function() {
            return this.first_name + ' ' + this.last_name;
        }
    }
});

module.exports = Customer;