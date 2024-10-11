const { contextBridge, ipcRenderer } = require('electron');



console.log("Preload script loaded");

contextBridge.exposeInMainWorld('api', {
    showPasswordWindow: () => ipcRenderer.send('show-password'),
    addPasswordWindow: () => ipcRenderer.send('add-password'),
    loginSuccessWindow: () => ipcRenderer.send('login-success'),
    setPasswordWindow: () => ipcRenderer.send('password-set'),

    // Encryption APIs
    setEncryptionService: (masterPassword) => ipcRenderer.invoke('set-encryption-service', masterPassword),
    deriveKey: (salt) => ipcRenderer.invoke('derive-key', salt),
    encrypt: async (plaintext) => await ipcRenderer.invoke('encrypt', plaintext),
    decrypt: (encryptedData, iv, tag, salt) => ipcRenderer.invoke('decrypt', encryptedData, iv, tag, salt),

    setMasterPassword: async (masterPassword) => {
        return await ipcRenderer.invoke('set-master-password', masterPassword);
    },

    savePassword: async (dto) => {
        return await ipcRenderer.invoke('db-save-login', dto);
    },

    retrievePassword: async () => {
        return await ipcRenderer.invoke('db-retrieve-login');
    },

    generatePassword: async () => {
        return await ipcRenderer.invoke('generate-password');
    }
});
