const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Sequelize, Op } = require('sequelize'); // Import Sequelize and Op
const sequelize = require('./server/util/database');
const cron = require('node-cron');
require('dotenv').config();

const app = express();

// Middleware setup
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

// Routes setup
const userRoutes = require('./server/routes/user');
const jobLogRoutes = require('./server/routes/jobLogs');
const reminderRoutes = require('./server/routes/reminder');
app.use('/user', userRoutes);
app.use('/home', jobLogRoutes);
app.use('/reminder', reminderRoutes);

// Sequelize associations
const User = require('./server/models/user');
const JobLog = require('./server/models/jobLogs');
const Reminder = require('./server/models/reminders');

// Define associations
User.hasMany(JobLog);
JobLog.belongsTo(User);

User.hasMany(Reminder);
Reminder.belongsTo(User);

// Start server and synchronize Sequelize models
sequelize.sync().then(() => {
    app.listen(3000, () => {
        console.log('Server is running on port 3000');
    });
}).catch((err) => {
    console.error('Unable to connect to the database:', err);
});

// Schedule cron job to send reminders
cron.schedule('* * * * *', async () => {
    try {
        const reminders = await Reminder.findAll({
            where: {
                reminder_date: {
                    [Op.lte]: new Date(), // Correct usage of Sequelize Op
                },
            },
        });

        reminders.forEach(async (reminder) => {
            try {
                const { company_name, job_title, notes } = reminder;

                // Implement reminder sending logic here
                console.log(`Sending reminder email for ${job_title} at ${company_name}`);

            } catch (error) {
                console.error('Error sending reminder email:', error);
            }
        });
    } catch (error) {
        console.error('Error fetching reminders:', error);
    }
});

module.exports = app;
