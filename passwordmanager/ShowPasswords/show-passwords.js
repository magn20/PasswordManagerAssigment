async function retrieveAllLogins() {
    try {
        const logins = await window.api.retrievePassword();
        displayLogins(logins);
    } catch (error) {
        console.error('Error retrieving all logins:', error);
    }
}

function displayLogins(logins) {
    const loginCardsContainer = document.getElementById('login-cards');
    loginCardsContainer.innerHTML = '';
    logins.forEach(login => {
        const card = document.createElement('div');
        card.className = 'bg-white shadow-lg rounded-lg p-4 hover:shadow-xl transition-shadow duration-200';

        //  card content
        card.innerHTML = `
            <h2 class="text-lg font-semibold mb-2">${login.website}</h2>
            <div class="details hidden">
                <label class="block text-sm font-medium text-gray-700">Username</label>
                <input type="text" value="${login.username}" readonly class="w-full px-3 py-2 mb-4 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed" />
                
                <label class="block text-sm font-medium text-gray-700">Password</label>
                <div class="relative mb-4">
                    <input type="password" id="password" value="${login.password}" readonly class="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed" />
                    <button type="button" class="absolute inset-y-0 right-0 px-2 text-gray-500 toggle-password-visibility">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 eye-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.522 5 12 5s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7s-8.268-2.943-9.542-7z" />
                        </svg>
                    </button>
                </div>
            </div>
            <button class="text-blue-500 mt-2 toggle-details">Show Details</button>
        `;

        // Toggle to show/hide username and password details
        card.querySelector('.toggle-details').addEventListener('click', async (event) => {
            event.stopPropagation();

            //call decryption of password
            let decryptedPassword = await window.api.decrypt(login.password, login.iv, login.tag, login.salt);
            login.password = decryptedPassword;

            //uodate password field
            const passwordField = card.querySelector('input[type="password"]');
            passwordField.value = decryptedPassword;


            //hide || unhide card
            const details = card.querySelector('.details');
            details.classList.toggle('hidden');
            event.target.textContent = details.classList.contains('hidden') ? 'Show Details' : 'Hide Details';
        });

        // Password visibility toggle logic
        const togglePasswordVisibilityBtn = card.querySelector('.toggle-password-visibility');
        const passwordField = card.querySelector('input[type="password"]');

        togglePasswordVisibilityBtn.addEventListener('click', () => {
            const isPasswordVisible = passwordField.getAttribute('type') === 'text';
            passwordField.setAttribute('type', isPasswordVisible ? 'password' : 'text');

            // Toggle eye icon
            const eyeIcon = togglePasswordVisibilityBtn.querySelector('.eye-icon');
            if (isPasswordVisible) {
                // Update to eye icon (closed)
                eyeIcon.innerHTML = `
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.522 5 12 5s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7s-8.268-2.943-9.542-7z" />
                `;
            } else {
                // Update to eye-slash icon (open)
                eyeIcon.innerHTML = `
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4l16 16" />
                `;
            }
        });

        loginCardsContainer.appendChild(card);
    });
}


//get logins on loaded
document.addEventListener('DOMContentLoaded', async () => {
    await retrieveAllLogins();
});

//return to main page
document.getElementById('go-back').addEventListener('click', () => {
    window.api.loginSuccessWindow();
});