const Sequelize = require('sequelize');
const sequelize = require('../util/database');

// Define User model
const jobLogs = sequelize.define('jobLogs', {
    companyName: {
        type: Sequelize.STRING,
        allowNull: false
    },
    jobTitle: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    jobStatus: {
        type: Sequelize.STRING,
        allowNull: false
    },
    notes: {
        type: Sequelize.STRING,
        allowNull: false
    },
    dateApplied: {
        type: Sequelize.DATE,
        allowNull: false
    }
});

module.exports = jobLogs;
