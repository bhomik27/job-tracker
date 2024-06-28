document.addEventListener('DOMContentLoaded', async () => {
    await fetchChartData();
});

async function fetchChartData() {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:3000/home/jobs', {
            headers: {
                'Authorization': token
            }
        });

        const jobLogs = response.data;
        const statusData = getStatusData(jobLogs);
        const dateData = getDateData(jobLogs);

        renderStatusChart(statusData);
        renderDateChart(dateData);
    } catch (error) {
        console.error('There was an error fetching the chart data!', error);
    }
}

function getStatusData(jobLogs) {
    const statusCounts = jobLogs.reduce((acc, job) => {
        acc[job.jobStatus] = (acc[job.jobStatus] || 0) + 1;
        return acc;
    }, {});

    return {
        labels: Object.keys(statusCounts),
        data: Object.values(statusCounts)
    };
}

function getDateData(jobLogs) {
    const dateCounts = jobLogs.reduce((acc, job) => {
        const date = new Date(job.dateApplied).toLocaleDateString('en-GB', {
            month: 'short',
            year: 'numeric'
        });
        acc[date] = (acc[date] || 0) + 1;
        return acc;
    }, {});

    return {
        labels: Object.keys(dateCounts),
        data: Object.values(dateCounts)
    };
}

function renderStatusChart(statusData) {
    const ctx = document.getElementById('statusChart').getContext('2d');
    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: statusData.labels,
            datasets: [{
                label: 'Job Status',
                data: statusData.data,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)'
                ],
                borderWidth: 1
            }]
        }
    });
}

function renderDateChart(dateData) {
    const ctx = document.getElementById('dateChart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: dateData.labels,
            datasets: [{
                label: 'Job Applications by Date',
                data: dateData.data,
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                x: {
                    beginAtZero: true
                },
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}
