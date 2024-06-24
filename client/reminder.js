document.addEventListener('DOMContentLoaded', () => {
    getAllReminders(); // Fetch reminders when the DOM is loaded

    const addReminderForm = document.getElementById('addReminderForm');
    addReminderForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        // Gather form data using FormData object
        const formData = new FormData(addReminderForm);
        const reminderData = {
            company_name: formData.get('company_name'),
            job_title: formData.get('job_title'),
            notes: formData.get('notes'),
            reminder_date: formData.get('reminder_date'),
            reminder_time: formData.get('reminder_time')
        };

        await addReminder(reminderData); // Call function to add a new reminder
    });
});

const getAllReminders = async () => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:3000/reminder/getAllReminders', {
            headers: {
                'Authorization': token
            }
        });
        const reminders = response.data;
        displayReminders(reminders); // Display fetched reminders
    } catch (error) {
        console.error('Error fetching reminders:', error);
        alert('Failed to fetch reminders. Please try again.');
    }
};

const displayReminders = (reminders) => {
    const remindersTable = document.getElementById('remindersTable');
    
    if (!remindersTable) {
        console.error('Reminders table element not found.');
        return;
    }

    remindersTable.innerHTML = ''; // Clear existing table rows

    reminders.forEach(reminder => {
        const row = document.createElement('tr');

        // Create table cells for each reminder property
        const companyNameCell = createTableCell(reminder.company_name);
        const jobTitleCell = createTableCell(reminder.job_title);
        const notesCell = createTableCell(reminder.notes);
        const reminderDateTimeCell = createTableCell(formatDateTime(reminder.reminder_date, reminder.reminder_time));

        // Create Edit and Delete buttons for each reminder
        const editButton = createButton('Edit', 'btn-primary', () => editReminder(reminder.id));
        const deleteButton = createButton('Delete', 'btn-danger', () => deleteReminder(reminder.id));

        const actionsCell = document.createElement('td');
        actionsCell.appendChild(editButton);
        actionsCell.appendChild(deleteButton);

        // Append cells to the row and then append the row to the table
        appendCellsToRow(row, [companyNameCell, jobTitleCell, notesCell, reminderDateTimeCell, actionsCell]);
        remindersTable.appendChild(row);
    });
};

const createTableCell = (text) => {
    const cell = document.createElement('td');
    cell.textContent = text;
    return cell;
};

const createButton = (text, className, onClick) => {
    const button = document.createElement('button');
    button.textContent = text;
    button.classList.add('btn', 'btn-sm', className, 'mr-2');
    button.addEventListener('click', onClick);
    return button;
};

const appendCellsToRow = (row, cells) => {
    cells.forEach(cell => row.appendChild(cell));
};

const formatDateTime = (date, time) => {
    const dateTimeString = `${date}T${time}`;
    const formattedDateTime = new Date(dateTimeString);
    return formattedDateTime.toLocaleString(); // Format date and time nicely
};

// Handle POST request to add a new reminder
const addReminder = async (reminderData) => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.post('http://localhost:3000/reminder/add-reminder', reminderData, {
            headers: {
                'Authorization': token
            }
        });

        alert('Reminder added successfully!');
        clearFormFields(); // Clear form fields after successful addition
        getAllReminders(); // Refresh reminders list
    } catch (error) {
        console.error('Error adding reminder:', error);
        alert('Failed to add reminder. Please try again.');
    }
};

const editReminder = async (id) => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:3000/reminder/getReminder/${id}`, {
            headers: {
                'Authorization': token
            }
        });

        const reminder = response.data;

        // Pre-fill form fields with current reminder details
        document.getElementById('company-name').value = reminder.company_name;
        document.getElementById('job-title').value = reminder.job_title;
        document.getElementById('notes').value = reminder.notes;
        document.getElementById('reminder-date').value = reminder.reminder_date;
        document.getElementById('reminder-time').value = reminder.reminder_time;

        // Prompt for new values for all fields
        const newCompanyName = prompt('Enter new company name (or leave blank to keep current):', reminder.company_name) || reminder.company_name;
        const newJobTitle = prompt('Enter new job title (or leave blank to keep current):', reminder.job_title) || reminder.job_title;
        const newNotes = prompt('Enter new notes (or leave blank to keep current):', reminder.notes) || reminder.notes;
        const newReminderDate = prompt('Enter new reminder date (YYYY-MM-DD) (or leave blank to keep current):', reminder.reminder_date) || reminder.reminder_date;
        const newReminderTime = prompt('Enter new reminder time (HH:MM) (or leave blank to keep current):', reminder.reminder_time) || reminder.reminder_time;

        // Update the reminder with the new values
        const updateData = {
            company_name: newCompanyName,
            job_title: newJobTitle,
            notes: newNotes,
            reminder_date: newReminderDate,
            reminder_time: newReminderTime
        };

        const updateResponse = await axios.put(`http://localhost:3000/reminder/edit-reminder/${id}`, updateData, {
            headers: {
                'Authorization': token
            }
        });

        console.log(updateResponse);

        alert('Reminder updated successfully!');
        clearFormFields(); // Clear form fields after successful update
        getAllReminders(); // Refresh reminders list after update
    } catch (error) {
        console.error('Error updating reminder:', error);
        alert('Failed to update reminder. Please try again.');
    }
};



const deleteReminder = async (id) => {
    if (!confirm('Are you sure you want to delete this reminder?')) return;

    try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:3000/reminder/delete-reminder/${id}`, {
            headers: {
                'Authorization': token
            }
        });
        
        alert('Reminder deleted successfully!');
        getAllReminders(); // Refresh reminders list after deletion
    } catch (error) {
        console.error('Error deleting reminder:', error);
        alert('Failed to delete reminder. Please try again.');
    }
};

const clearFormFields = () => {
    // Clear all form fields
    document.getElementById('company-name').value = '';
    document.getElementById('job-title').value = '';
    document.getElementById('notes').value = '';
    document.getElementById('reminder-date').value = '';
    document.getElementById('reminder-time').value = '';
};
