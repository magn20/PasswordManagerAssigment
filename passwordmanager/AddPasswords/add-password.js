

// Function to generate a secure password
async function generateSecurePassword() {
    try {
        const result = await window.api.generatePassword();
        if (result) {
            return result; // will return the generated password
        }
    } catch (error) {
        console.error("Error generating password:", error);
    }
    return false; // Will return false if something went wrong
}

const passwordField = document.getElementById('password');
const togglePasswordButton = document.getElementById('toggle-password');
const eyeSlash = document.getElementById('eye-slash');

//toggle for password visibility
togglePasswordButton.addEventListener('click', () => {
    const isPasswordVisible = passwordField.getAttribute('type') === 'text';

    if (isPasswordVisible) {
        // Hides password
        passwordField.setAttribute('type', 'password');
        eyeSlash.classList.add('hidden');
    } else {
        //shows password
        passwordField.setAttribute('type', 'text');
        eyeSlash.classList.remove('hidden');
    }
});

// Event listener for the Generate Secure Password
document.getElementById('generate-password').addEventListener('click', async () => {
    const passwordField = document.getElementById('password');
    try {
        const newPassword = await generateSecurePassword();
        if (newPassword) {
            passwordField.value = newPassword;
            alert('Generated secure password: ' + newPassword);
        } else {
            alert('Failed to generate password.');
        }
    } catch (error) {
        console.error("Error during password generation:", error);
        alert('An error occurred while generating the password.');
    }
});


let dto = {};
//add login
document.getElementById('add-login-form').addEventListener('submit', async (event) => {
    event.preventDefault();

    const website = document.getElementById('website').value;
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        const result = await window.api.encrypt(password); // Await the promise here
        if (result) {
            // Assign values to the dto object
            dto = {
                website: website,
                username: username,
                encryptedData: result.encryptedData,
                iv: result.iv,
                tag: result.tag,
                salt: result.salt,
            };

            console.log("Logging dto");
            console.log(dto);

             await window.api.savePassword(dto);

        } else {
            alert('Failed encryption');
        }
    } catch (error) {
        console.error("Error:", error);
    }

    alert('Saved successfully!');
    window.api.loginSuccessWindow();

});


//goto to main menu
document.getElementById('go-back').addEventListener('click', () => {
    window.api.loginSuccessWindow();
});