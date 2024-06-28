document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('signup-form');

    form.addEventListener('submit', signup);

    async function signup(event) {
        event.preventDefault();

        try {
            // Fetch input values
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const phone = document.getElementById('phone').value;

            // Construct signupData object
            const signupData = { name, email, password, phone };

            // Send signupData to the backend
            await axios.post("http://localhost:3000/user/signup", signupData);

            // Clear input fields after successful signup
            document.getElementById('name').value = '';
            document.getElementById('email').value = '';
            document.getElementById('password').value = '';
            document.getElementById('phone').value = '';

            // Display success alert
            alert("User signup successful!");
            window.location.href = "./login.html";

        } catch (error) {
            // Handle errors
            if (error.response && error.response.status === 409) {
                // If the status code is 409 (User already exists), display error alert
                alert("User already exists, Please Login");
            } else {
                // Log other errors to the console
                console.error(error.response ? error.response.data : error.message);
            }
        }
    }
});
