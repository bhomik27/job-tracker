const Sequelize = require('sequelize');
require('dotenv').config(); // This loads the environment variables from the .env file

// Create a new Sequelize instance with the provided configuration
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    dialect: 'mysql',
    host: process.env.DB_HOST
});

// Test the connection
sequelize.authenticate()
    .then(() => {
        console.log('Connection has been established successfully.');
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });

module.exports = sequelize;