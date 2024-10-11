document.getElementById('set-password-form').addEventListener('submit', async (event) => {
    event.preventDefault();

    const masterPassword = document.getElementById('master-password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    const errorMessage = document.getElementById('error-message');


    errorMessage.classList.add('hidden');


    if (masterPassword !== confirmPassword) {
        errorMessage.textContent = "Passwords don't match!";
        errorMessage.classList.remove('hidden');
        return;
    }

    if (!masterPassword) {
        alert("Password cannot be empty.");
        return;
    }

    const success = await window.api.setMasterPassword(masterPassword);

    if (success) {
        alert("Master password set successfully!");
        window.api.setPasswordWindow();
    } else {
        alert("Failed to set the master password.");
    }
});
