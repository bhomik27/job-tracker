
document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('profile-form');

    form.addEventListener('submit', async function (event) {
        event.preventDefault();

        try {
            const firstName = document.getElementById('firstName').value;
            const lastName = document.getElementById('lastName').value;
            const email = document.getElementById('email').value;
            const mobile = document.getElementById('mobile').value;

            const userDetails = {
                id: localStorage.getItem('userId'), 
                name: `${firstName} ${lastName}`,
                email,
                phone: mobile
            };

            const token = localStorage.getItem('token'); 

            const response = await axios.put('http://localhost:3000/user/updateUserDetails', userDetails, {
                headers: {
                    'Authorization': token
                }
            });

            alert(response.data.message);
        } catch (error) {
            console.error('Error updating profile details:', error);
            alert(error.response ? error.response.data.message : 'Error updating profile details. Please try again later.');
        }
    });
});