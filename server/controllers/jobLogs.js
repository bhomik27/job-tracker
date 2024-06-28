const { Op } = require('sequelize');
const JobLog = require('../models/jobLogs'); // Adjust the path according to your project structure

const getJobLogs = async (req, res, next) => {
    const { companyName, jobStatus, sortBy } = req.query;
    let whereClause = {};

    if (companyName) {
        whereClause.companyName = {
            [Op.like]: `%${companyName}%`
        };
    }

    if (jobStatus) {
        whereClause.jobStatus = jobStatus;
    }

    let orderBy = [['createdAt', 'DESC']]; // Default sorting
    if (sortBy === 'companyName') {
        orderBy = [['companyName', 'ASC']];
    } else if (sortBy === 'dateApplied') {
        orderBy = [['dateApplied', 'DESC']];
    }

    try {
        const jobLogs = await JobLog.findAll({
            where: whereClause,
            order: orderBy
        });
        res.status(200).json(jobLogs);
    } catch (error) {
        res.status(500).json({ error: 'There was an error fetching the job logs' });
    }
};

const addJobLog = async (req, res, next) => {
    const { companyName, jobTitle, jobStatus, notes, dateApplied } = req.body;
    try {
        const newJobLog = await JobLog.create({
            companyName,
            jobTitle,
            jobStatus,
            notes,
            dateApplied
        });
        res.status(201).json(newJobLog);
    } catch (error) {
        res.status(500).json({ error: 'There was an error adding the job log' });
    }
};

const deleteJobLog = async (req, res, next) => {
    const { id } = req.params;
    try {
        const result = await JobLog.destroy({ where: { id } });
        if (result) {
            res.status(200).json({ message: 'Job log deleted successfully' });
        } else {
            res.status(404).json({ message: 'Job log not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'There was an error deleting the job log' });
    }
};

const editJobLog = async (req, res, next) => {
    const { id } = req.params;
    const { companyName, jobTitle, jobStatus, notes, dateApplied } = req.body;
    try {
        const jobLog = await JobLog.findByPk(id);
        if (jobLog) {
            jobLog.companyName = companyName;
            jobLog.jobTitle = jobTitle;
            jobLog.jobStatus = jobStatus;
            jobLog.notes = notes;
            jobLog.dateApplied = dateApplied;
            await jobLog.save();
            res.status(200).json(jobLog);
        } else {
            res.status(404).json({ message: 'Job log not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'There was an error updating the job log' });
    }
};

module.exports = {
    addJobLog,
    getJobLogs,
    deleteJobLog,
    editJobLog
};
