const Reminder = require('../models/Reminder');

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
