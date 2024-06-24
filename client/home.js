document.addEventListener('DOMContentLoaded', async (event) => {
    await fetchJobLogs();
});

async function addJob() {
    const companyName = document.getElementById('company-name').value;
    const jobTitle = document.getElementById('job-title').value;
    const jobStatus = document.getElementById('job-status').value;
    const notes = document.getElementById('notes').value;
    const dateApplied = document.getElementById('date-applied').value; // Expecting yyyy-MM-dd format

    const jobData = {
        companyName: companyName,
        jobTitle: jobTitle,
        jobStatus: jobStatus,
        notes: notes,
        dateApplied: dateApplied
    };

    try {
        const token = localStorage.getItem('token');
        const response = await axios.post('http://localhost:3000/home/addJob', jobData, {
            headers: {
                'Authorization': token
            }
        });

        addJobToTable(response.data);
        document.getElementById('job-form').reset();
    } catch (error) {
        console.error('There was an error adding the job!', error);
    }
}


async function fetchJobLogs() {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:3000/home/jobs', {
            headers: {
                'Authorization': token
            }
        });

        const jobs = response.data;
        jobs.forEach(job => {
            addJobToTable(job);
        });
    } catch (error) {
        console.error('There was an error fetching the job logs!', error);
    }
}

function formatDate(dateString) {
    const options = { day: '2-digit', month: 'short', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-GB', options).replace(/ /g, '/');
}

function addJobToTable(job) {
    // Remove the old job entry if it exists
    const existingRow = document.querySelector(`tr[data-id="${job.id}"]`);
    if (existingRow) {
        existingRow.remove();
    }

    const formattedDate = formatDate(job.dateApplied);

    const newRow = document.createElement('tr');
    newRow.setAttribute('data-id', job.id);
    newRow.innerHTML = `
        <td>${job.companyName}</td>
        <td>${job.jobTitle}</td>
        <td>${job.jobStatus}</td>
        <td>${job.notes}</td>
        <td>${formattedDate}</td>
        <td>
            <button class="btn btn-primary btn-sm edit-btn" data-id="${job.id}">Edit</button>
            <button class="btn btn-danger btn-sm delete-btn" data-id="${job.id}">Delete</button>
        </td>
    `;

    document.getElementById('job-list').appendChild(newRow);

    newRow.querySelector('.edit-btn').addEventListener('click', () => editJob(job));
    newRow.querySelector('.delete-btn').addEventListener('click', () => deleteJob(job.id));
}


function editJob(job) {
    document.getElementById('company-name').value = job.companyName;
    document.getElementById('job-title').value = job.jobTitle;
    document.getElementById('job-status').value = job.jobStatus;
    document.getElementById('notes').value = job.notes;

    // Format the date to yyyy-MM-dd for the input field
    const dateApplied = new Date(job.dateApplied).toISOString().split('T')[0];
    document.getElementById('date-applied').value = dateApplied;

    const saveButton = document.getElementById('save-button');
    saveButton.textContent = 'Update';
    saveButton.onclick = () => updateJob(job.id);
}


async function updateJob(jobId) {
    const companyName = document.getElementById('company-name').value;
    const jobTitle = document.getElementById('job-title').value;
    const jobStatus = document.getElementById('job-status').value;
    const notes = document.getElementById('notes').value;
    const dateApplied = document.getElementById('date-applied').value; // Expecting yyyy-MM-dd format

    const jobData = {
        companyName: companyName,
        jobTitle: jobTitle,
        jobStatus: jobStatus,
        notes: notes,
        dateApplied: dateApplied
    };

    try {
        const token = localStorage.getItem('token');
        await axios.put(`http://localhost:3000/home/editJob/${jobId}`, jobData, {
            headers: {
                'Authorization': token
            }
        });

        await fetchJobLogs();
        document.getElementById('job-form').reset();

        const saveButton = document.getElementById('save-button');
        saveButton.textContent = 'Save';
        saveButton.onclick = addJob;
    } catch (error) {
        console.error('There was an error updating the job!', error);
    }
}


async function deleteJob(jobId) {
    try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:3000/home/deleteJob/${jobId}`, {
            headers: {
                'Authorization': token
            }
        });

        document.getElementById('job-list').innerHTML = '';
        await fetchJobLogs();
    } catch (error) {
        console.error('There was an error deleting the job!', error);
    }
}


async function sendReminders() {
    try {
        const token = localStorage.getItem('token');
        await axios.post('http://localhost:3000/home/sendReminders', {}, {
            headers: {
                'Authorization': token
            }
        });
        alert('Reminders sent successfully!');
    } catch (error) {
        console.error('There was an error sending the reminders!', error);
    }
}

