const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const Reminder = sequelize.define('Reminder', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    company_name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    job_title: {
        type: Sequelize.STRING,
        allowNull: false
    },
    notes: {
        type: Sequelize.TEXT,
        allowNull: true
    },
    reminder_date: {
        type: Sequelize.DATE,
        allowNull: false
    },
    reminder_time: {
        type: Sequelize.TIME,
        allowNull: false
    }
});

module.exports = Reminder;
