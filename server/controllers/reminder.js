const cron = require('node-cron');
const { Op } = require('sequelize');
const SibApiV3Sdk = require('sib-api-v3-sdk');
const Reminder = require('../models/reminders');
require('dotenv').config();

// Initialize SendinBlue API client
const apikey = process.env.SENDINBLUE_API_KEY;
const defaultClient = SibApiV3Sdk.ApiClient.instance;
const apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = apikey;

// Create instance of TransactionalEmailsApi
const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

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

                // Send email reminder using SendinBlue
                const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
                sendSmtpEmail.subject = `Reminder: ${job_title} at ${company_name}`;
                sendSmtpEmail.htmlContent = `<html><body><p>Reminder for ${job_title} at ${company_name}.</p><p>Notes: ${notes}</p></body></html>`;
                sendSmtpEmail.sender = { name: 'Job Tracker', email: 'bhomikmaheshwari27@gmail.com' }; // Update sender details
                sendSmtpEmail.to = [{ email: 'bhomikmaheshwari27@gmail.com', name: 'Job-Tracker' }]; // Update recipient details

                // Send email using SendinBlue API
                await apiInstance.sendTransacEmail(sendSmtpEmail);

                console.log(`Reminder email sent for ${job_title} at ${company_name}`);
            } catch (error) {
                console.error('Error sending reminder email:', error);
            }
        });
    } catch (error) {
        console.error('Error fetching reminders:', error);
    }
});


const addReminder = async (req, res) => {
    try {
        const { company_name, job_title, notes, reminder_date, reminder_time } = req.body;
        const newReminder = await Reminder.create({
            company_name,
            job_title,
            notes,
            reminder_date,
            reminder_time
        });

        // Send email reminder using SendinBlue
        const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

        sendSmtpEmail.subject = `Reminder: ${job_title} at ${company_name}`;
        sendSmtpEmail.htmlContent = `<html><body><p>Reminder for ${job_title} at ${company_name}.</p><p>Notes: ${notes}</p></body></html>`;
        sendSmtpEmail.sender = { name: 'Job Tracker', email: 'bhomikmaheshwari27@gmail.com' };

        // Fetch recipient email dynamically from your reminder data
        const recipientEmail = 'bhomikmaheshwari27@gmail.com'; // Replace with actual dynamic email fetching logic

        sendSmtpEmail.to = [{ email: recipientEmail, name: 'Recipient Name' }];

        // Send email using SendinBlue API
        await apiInstance.sendTransacEmail(sendSmtpEmail);

        res.status(201).json({ message: 'Reminder added successfully', reminder: newReminder });
    } catch (error) {
        console.error('Error adding reminder:', error);
        res.status(500).json({ message: 'Failed to add reminder' });
    }
};


const getAllReminders = async (req, res) => {
    try {
        const reminders = await Reminder.findAll();
        res.status(200).json(reminders);
    } catch (error) {
        console.error('Error fetching reminders:', error);
        res.status(500).json({ message: 'Failed to fetch reminders' });
    }
};

const editReminder = async (req, res) => {
    const { id } = req.params;
    const { company_name } = req.body;

    try {
        let reminderToUpdate = await Reminder.findByPk(id);

        if (!reminderToUpdate) {
            return res.status(404).json({ message: 'Reminder not found' });
        }

        reminderToUpdate.company_name = company_name;
        await reminderToUpdate.save();

        res.status(200).json({ message: 'Reminder updated successfully', reminder: reminderToUpdate });
    } catch (error) {
        console.error('Error updating reminder:', error);
        res.status(500).json({ message: 'Failed to update reminder' });
    }
};

const deleteReminder = async (req, res) => {
    const { id } = req.params;

    try {
        const reminderToDelete = await Reminder.findByPk(id);

        if (!reminderToDelete) {
            return res.status(404).json({ message: 'Reminder not found' });
        }

        await reminderToDelete.destroy();

        res.status(200).json({ message: 'Reminder deleted successfully' });
    } catch (error) {
        console.error('Error deleting reminder:', error);
        res.status(500).json({ message: 'Failed to delete reminder' });
    }
};

const getReminderById = async (req, res) => {
    const { id } = req.params;

    try {
        const reminder = await Reminder.findByPk(id);

        if (!reminder) {
            return res.status(404).json({ message: 'Reminder not found' });
        }

        res.status(200).json(reminder);
    } catch (error) {
        console.error('Error fetching reminder:', error);
        res.status(500).json({ message: 'Failed to fetch reminder' });
    }
};

module.exports = {
    addReminder,
    getAllReminders,
    editReminder,
    deleteReminder,
    getReminderById
};

