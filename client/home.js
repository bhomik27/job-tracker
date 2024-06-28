let jobLogsCache = []; // Cache to store all job logs
let currentPage = 1;
const limit = 10;

document.addEventListener('DOMContentLoaded', async (event) => {
    await fetchJobLogs();
    document.getElementById('search-input').addEventListener('input', handleSearch);
    document.getElementById('filter-status').addEventListener('change', applyFilters);
    document.getElementById('sort-by').addEventListener('change', applyFilters);
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

        jobLogsCache = response.data; // Cache all job logs
        renderJobLogs(jobLogsCache); // Render all job logs
    } catch (error) {
        console.error('There was an error fetching the job logs!', error);
    }
}

function handleSearch() {
    applyFilters();
}

function applyFilters() {
    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    const statusFilter = document.getElementById('filter-status').value;
    const sortBy = document.getElementById('sort-by').value;

    let filteredJobs = jobLogsCache.filter(job =>
        job.companyName.toLowerCase().includes(searchTerm) ||
        job.jobTitle.toLowerCase().includes(searchTerm)
    );

    if (statusFilter) {
        filteredJobs = filteredJobs.filter(job => job.jobStatus === statusFilter);
    }

    if (sortBy) {
        filteredJobs.sort((a, b) => {
            if (sortBy === 'companyName') {
                return a.companyName.localeCompare(b.companyName);
            } else if (sortBy === 'dateApplied') {
                return new Date(b.dateApplied) - new Date(a.dateApplied);
            }
        });
    }

    renderJobLogs(filteredJobs); // Render filtered and sorted job logs
}

function renderJobLogs(jobs) {
    const jobList = document.getElementById('job-list');
    jobList.innerHTML = ''; // Clear existing rows

    jobs.forEach(job => {
        addJobToTable(job);
    });
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
    newRow.setAttribute('data-id', job.id); // Add data-id attribute to store the job id

    newRow.innerHTML = `
        <td>${job.companyName}</td>
        <td>${job.jobTitle}</td>
        <td>${job.jobStatus}</td>
        <td>${job.notes}</td>
        <td>${formattedDate}</td>
        <td>
            <button type="button" class="btn btn-danger btn-sm" onclick="deleteJob(${job.id})">Delete</button>
            <button type="button" class="btn btn-primary btn-sm" onclick="editJob(${job.id})">Edit</button>
        </td>
    `;

    document.getElementById('job-list').appendChild(newRow);
}

async function deleteJob(jobId) {
    try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:3000/home/jobs/${jobId}`, {
            headers: {
                'Authorization': token
            }
        });

        // Remove the job from the cache and re-render the table
        jobLogsCache = jobLogsCache.filter(job => job.id !== jobId);
        renderJobLogs(jobLogsCache);
    } catch (error) {
        console.error('There was an error deleting the job!', error);
    }
}

function editJob(jobId) {
    const job = jobLogsCache.find(job => job.id === jobId);
    if (job) {
        document.getElementById('company-name').value = job.companyName;
        document.getElementById('job-title').value = job.jobTitle;
        document.getElementById('job-status').value = job.jobStatus;
        document.getElementById('notes').value = job.notes;
        document.getElementById('date-applied').value = job.dateApplied; // Assuming the format is yyyy-MM-dd

        // Scroll to the form
        window.scrollTo({ top: 0, behavior: 'smooth' });

        // Replace the 'Save' button with an 'Update' button
        const saveButton = document.getElementById('save-button');
        saveButton.textContent = 'Update';
        saveButton.onclick = async function () {
            await updateJob(jobId);
        };
    }
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
        const response = await axios.put(`http://localhost:3000/home/jobs/${jobId}`, jobData, {
            headers: {
                'Authorization': token
            }
        });

        // Update the job in the cache and re-render the table
        const index = jobLogsCache.findIndex(job => job.id === jobId);
        jobLogsCache[index] = response.data;
        renderJobLogs(jobLogsCache);

        document.getElementById('job-form').reset();

        // Replace the 'Update' button with the original 'Save' button
        const saveButton = document.getElementById('save-button');
        saveButton.textContent = 'Save';
        saveButton.onclick = addJob;
    } catch (error) {
        console.error('There was an error updating the job!', error);
    }
}
