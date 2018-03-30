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
// const Company = require('../models/company');
const Address = require('../models/address');
// const Job = require('../models/job');
// const JobApplications = require('../models/jobApplication');
//
//
//
//
// // One to many, comapany has more employees
// Employee.belongsTo(Company);
// Job.belongsTo(Company);
//
// // one to one relationship, will give a foreign key in temp_employees of address
// Address.hasOne(Temp_Employee);
Address.hasOne(Customer);
// Address.hasOne(Company);
//
// // Many to many relationship, between company and temp_employees
// Temp_Employee.belongsToMany(Company, {through: 'Comp_Temp_Employees'});
// Company.belongsToMany(Temp_Employee, {through: 'Comp_Temp_Employees'});
//
// // Many to many relationship, between job and temp_employees
// Temp_Employee.belongsToMany(Job, {through: JobApplications});
// Job.belongsToMany(Temp_Employee, {through: JobApplications});
