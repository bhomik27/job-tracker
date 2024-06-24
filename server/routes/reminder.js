const express = require('express');
const router = express.Router();
const Userauthentication = require('../middleware/auth');
const reminderController = require('../controllers/reminder');

router.post('/add-reminder', Userauthentication.authenticate, reminderController.addReminder);
router.get('/getAllReminders', Userauthentication.authenticate, reminderController.getAllReminders);
router.put('/edit-reminder/:id', Userauthentication.authenticate, reminderController.editReminder);
router.delete('/delete-reminder/:id', Userauthentication.authenticate, reminderController.deleteReminder);
router.get('/getReminder/:id', Userauthentication.authenticate, reminderController.getReminderById);
module.exports = router;
