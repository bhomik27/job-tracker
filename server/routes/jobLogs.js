const express = require('express');
const jobLogsController = require('../controllers/jobLogs');
const router = express.Router();
const Userauthentication = require('../middleware/auth');


// Route to add a job log
router.post('/addJob',Userauthentication.authenticate, jobLogsController.addJobLog);

// Route to get all job logs
router.get('/jobs', Userauthentication.authenticate, jobLogsController.getJobLogs);

// Route to edit a job log
router.put('/editJob/:id', Userauthentication.authenticate, jobLogsController.editJobLog);

// Route to delete a job log
router.delete('/deleteJob/:id', Userauthentication.authenticate, jobLogsController.deleteJobLog);

module.exports = router;
