const Sequelize = require('sequelize');
const sequilizeDb = require('../config/db');

const Book = sequilizeDb.define('book', {
    title: {
        type: Sequelize.STRING(200),
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    author: {
        type: Sequelize.STRING(200),
        allowNull: false,
        validate: {
            notEmpty: true
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
        defaultValue: 0,
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