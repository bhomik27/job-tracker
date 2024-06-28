let currentPage = 1;
const jobsPerPage = 10;
let jobsData = [];

document.addEventListener('DOMContentLoaded', async () => {
    await fetchJobs();
    document.getElementById('searchInput').addEventListener('input', filterAndSortJobs);
    document.getElementById('locationInput').addEventListener('change', filterAndSortJobs);
    document.getElementById('sortInput').addEventListener('change', filterAndSortJobs);
    document.getElementById('prevPage').addEventListener('click', goToPreviousPage);
    document.getElementById('nextPage').addEventListener('click', goToNextPage);
});

async function fetchJobs() {
    try {
        const response = await axios.get('http://localhost:3000/api/jobs');
        jobsData = response.data.results;
        displayJobs(jobsData);
    } catch (error) {
        console.error('Error fetching jobs', error);
    }
}

function displayJobs(jobs) {
    const jobsContainer = document.getElementById('jobsContainer');
    jobsContainer.innerHTML = '';

    const startIndex = (currentPage - 1) * jobsPerPage;
    const endIndex = startIndex + jobsPerPage;
    const paginatedJobs = jobs.slice(startIndex, endIndex);

    paginatedJobs.forEach(job => {
        const jobElement = document.createElement('div');
        jobElement.className = 'col-md-6 mb-4';
        jobElement.innerHTML = `
            <div class="card">
                <div class="card-body">
                    <h5 class="card-title">${job.title}</h5>
                    <h6 class="card-subtitle mb-2 text-muted">${job.company.display_name}</h6>
                    <p class="card-text">${job.location.display_name}</p>
                    <a href="${job.redirect_url}" class="card-link" target="_blank">View Job</a>
                </div>
            </div>
        `;
        jobsContainer.appendChild(jobElement);
    });
}

function filterAndSortJobs() {
    let filteredJobs = jobsData;

    const searchInput = document.getElementById('searchInput').value.toLowerCase();
    const locationInput = document.getElementById('locationInput').value.toLowerCase();
    const sortInput = document.getElementById('sortInput').value;

    if (searchInput) {
        filteredJobs = filteredJobs.filter(job =>
            job.title.toLowerCase().includes(searchInput)
        );
    }

    if (locationInput) {
        filteredJobs = filteredJobs.filter(job =>
            job.location.display_name.toLowerCase().includes(locationInput)
        );
    }

    if (sortInput === 'title') {
        filteredJobs.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortInput === 'date') {
        filteredJobs.sort((a, b) => new Date(b.created) - new Date(a.created));
    }

    displayJobs(filteredJobs);
}

function goToPreviousPage(event) {
    event.preventDefault();
    if (currentPage > 1) {
        currentPage--;
        filterAndSortJobs();
    }
}

function goToNextPage(event) {
    event.preventDefault();
    if ((currentPage - 1) * jobsPerPage < jobsData.length) {
        currentPage++;
        filterAndSortJobs();
    }
}
