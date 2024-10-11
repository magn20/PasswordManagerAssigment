document.getElementById('loginButton').addEventListener('click', async (event) => {
    event.preventDefault();

    console.log(window.api);
    const masterPassword = document.getElementById('master-password').value;

    const success = await window.api.setEncryptionService(masterPassword);

    if (success) {
        window.api.loginSuccessWindow();
    } else {
        document.getElementById('error-message').style.display = 'block';
    }
});
