const Sequelize = require('sequelize');
const sequilizeDb = require('../config/db');

const Book = sequilizeDb.define('book', {
    title: {
        type: Sequelize.STRING(200),
        allowNull: false,
        validate: {
            notEmpty: true,
            is: ["^[a-z]+$",'i']
        }
    },
    author: {
        type: Sequelize.STRING(200),
        allowNull: false,
        validate: {
            notEmpty: true,
            is: ["^[a-z]+$",'i']
        }
    },
    category: {
        type: Sequelize.STRING(100),
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    price: {
        type: Sequelize.FLOAT(4, 2),
        allowNull: false,
        validate: {
            notEmpty: true,
            isFloat: true
        }

    },
    qty_in_stock: {
        type: Sequelize.INTEGER,
        allowNull: false,
        validate: {
            notEmpty: true,
            isInt: true
        }
    },
    image: {
        type: Sequelize.BLOB,
        allowNull: true,
        validate: {
            notEmpty: true
        }
    }
});

module.exports = Book;