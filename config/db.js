const Sequelize = require('sequelize');
const connection = new Sequelize('bookstore', 'root', 'root', {
    host: 'localhost',
    dialect: 'mysql',
    operatorsAliases: false,

    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
});

connection.authenticate().then(() => {
    console.log('Connection has been established successfully.');
}).catch(err => {
    console.error('Unable to connect to the database:', err);
});

module.exports = connection;

// // We'll define associations after we import them here
const Administrator = require('../models/administrator');
const Customer = require('../models/customer');
const Book = require('../models/book');
const Address = require('../models/address');
const LineItem = require('../models/line_item');
const Order = require('../models/order');
const Rating = require('../models/rating');
//
//
//
//
// // One to many, comapany has more employees
Customer.hasMany(Order, { foreignKey: { allowNull: false }, onDelete: 'CASCADE' });
Customer.hasMany(Address, { foreignKey: { allowNull: false }, onDelete: 'CASCADE'});
Address.hasMany(Order);

//
// // one to one relationship, will give a foreign key in temp_employees of address
// Address.hasOne(Temp_Employee);
// Address.hasOne(Company);
//
// // Many to many relationship, between company and temp_employees
// Temp_Employee.belongsToMany(Company, {through: 'Comp_Temp_Employees'});
// Company.belongsToMany(Temp_Employee, {through: 'Comp_Temp_Employees'});
//
// // Many to many relationship, between job and temp_employees
Book.belongsToMany(Customer, {through: Rating});
Customer.belongsToMany(Book, {through: Rating});

Book.belongsToMany(Order, {through: LineItem});
Order.belongsToMany(Book, {through: LineItem});
