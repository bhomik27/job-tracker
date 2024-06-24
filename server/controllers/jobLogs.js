const JobLog = require('../models/jobLogs');
const sequelize = require('../util/database');


// Function to add a job log
const addJobLog = async (req, res, next) => {
    const { companyName, jobTitle, jobStatus, notes, dateApplied } = req.body;
    const t = await sequelize.transaction();
    
    try {
        const jobLog = await JobLog.create({
            companyName,
            jobTitle,
            jobStatus,
            notes,
            dateApplied
        }, { transaction: t });
        
        await t.commit();
        res.status(201).json(jobLog);
    } catch (error) {
        await t.rollback();
        res.status(500).json({ error: 'There was an error adding the job log' });
    }
};

// Function to get all job logs
const getJobLogs = async (req, res, next) => {
    try {
        const jobLogs = await JobLog.findAll();
        res.status(200).json(jobLogs);
    } catch (error) {
        res.status(500).json({ error: 'There was an error fetching the job logs' });
    }
};

// Function to edit a job log
const editJobLog = async (req, res, next) => {
    const jobId = req.params.id;
    const { companyName, jobTitle, jobStatus, notes, dateApplied } = req.body;
    const t = await sequelize.transaction();

    try {
        const jobLog = await JobLog.findByPk(jobId, { transaction: t });
        
        if (jobLog) {
            jobLog.companyName = companyName;
            jobLog.jobTitle = jobTitle;
            jobLog.jobStatus = jobStatus;
            jobLog.notes = notes;
            jobLog.dateApplied = dateApplied;
            await jobLog.save({ transaction: t });
            
            await t.commit();
            res.status(200).json(jobLog);
        } else {
            await t.rollback();
            res.status(404).json({ error: 'Job log not found' });
        }
    } catch (error) {
        await t.rollback();
        res.status(500).json({ error: 'There was an error updating the job log' });
    }
};

// Function to delete a job log
const deleteJobLog = async (req, res, next) => {
    const jobId = req.params.id;
    const t = await sequelize.transaction();

    try {
        const jobLog = await JobLog.findByPk(jobId, { transaction: t });
        
        if (jobLog) {
            await jobLog.destroy({ transaction: t });
            await t.commit();
            res.status(204).json();
        } else {
            await t.rollback();
            res.status(404).json({ error: 'Job log not found' });
        }
    } catch (error) {
        await t.rollback();
        res.status(500).json({ error: 'There was an error deleting the job log' });
    }
};

module.exports = {
    addJobLog,
    getJobLogs,
    deleteJobLog,
    editJobLog
};
