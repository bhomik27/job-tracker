const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const sequelize = require('./server/util/database');
require('dotenv').config();


const app = express();


// Routes
const userRoutes = require('./server/routes/user');
const jobLogRoutes = require('./server/routes/jobLogs');
const reminderRoutes = require('./server/routes/reminder');



// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

// Use routes
app.use('/user', userRoutes);
app.use("/home", jobLogRoutes);
app.use("/reminder", reminderRoutes);

// Synchronize Sequelize models and start server
sequelize.sync()
    .then(() => {
        app.listen(3000, () => {
            console.log('Server is running on port 3000');
        });
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });
