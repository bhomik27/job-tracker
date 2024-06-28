const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Sequelize, Op } = require('sequelize'); 
const sequelize = require('./server/util/database');
const cron = require('node-cron');
require('dotenv').config();
const axios = require('axios');

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



// Add the jobs route
app.get('/api/jobs', async (req, res) => {
    try {
        const response = await axios.get('https://api.adzuna.com/v1/api/jobs/us/search/1', {
            params: {
                app_id: process.env.ADZUNA_APP_ID,
                app_key: process.env.ADZUNA_APP_KEY,
                results_per_page: 50
            }
        });
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching jobs:', error);
        res.status(500).send('Error fetching jobs');
    }
});




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
                console.log(`Sending reminder email for ${job_title} at ${company_name},  ${notes}`);

            } catch (error) {
                console.error('Error sending reminder email:', error);
            }
        });
    } catch (error) {
        console.error('Error fetching reminders:', error);
    }
});

module.exports = app;
