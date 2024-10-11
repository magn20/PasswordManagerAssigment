const {app, BrowserWindow, ipcMain} = require('electron');
const path = require('path');
const fs = require('fs');
const EncryptionService = require('./EncryptionService/EncryptionService');
const argon2 = require("argon2");
const crypto = require("crypto");
const db = require('./Database/database');


let mainWindow;
let encryptionService;


//creates new windows refactor to use same window later
function createWindow(filePath) {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname ,'preload.js'),
            nodeIntegration: false,   // Disable nodeIntegration for security
            enableRemoteModule: false,
            contextIsolation: true,   // Enable context isolation
        },
    });
    mainWindow.loadFile(filePath);

    //error finding
    //mainWindow.webContents.openDevTools();
}

// Check if the master password is already set
function isPasswordSet() {
    const passwordFilePath = path.join(__dirname, 'password-store.json');
    return fs.existsSync(passwordFilePath);
}


//close window
function  closeWindow(){
    console.log(mainWindow)
    if (mainWindow){
        mainWindow.close();
    }
}

//checks if master password exist
app.whenReady().then(() => {
    if (!isPasswordSet()) {
        // If the password is not set, open the set password window
        createWindow('MasterPassword/master-password.html');
    } else {
        // open the login window
        createWindow('Login/login.html');
    }
});

//region Routing via ipc
ipcMain.on('show-password', () => {
    closeWindow()
    createWindow('ShowPasswords/show-passwords.html');
});

ipcMain.on('add-password', () => {
    closeWindow()
    createWindow('AddPasswords/add-password.html');
});

ipcMain.on('login-success', () => {
    closeWindow()
    console.log("login success called")
    createWindow('src/index.html');
});

ipcMain.on('password-set', () => {
    closeWindow()
    createWindow('Login/login.html');
});
//endregion


//region Encryption via ipc

ipcMain.handle('derive-key', async (event, salt) => {
    if (!encryptionService) {
        throw new Error('EncryptionService is not initialized');
    }
    await encryptionService.deriveKey(salt);
});

ipcMain.handle('encrypt', async (event, plaintext) => {
    if (!encryptionService) {
        throw new Error('EncryptionService is not initialized');
    }
    return await encryptionService.encrypt(plaintext);
});

ipcMain.handle('decrypt', (event, encryptedData, iv, tag, salt) => {
    if (!encryptionService) {
        throw new Error('EncryptionService is not initialized');
    }
    return encryptionService.decrypt(encryptedData, iv, tag, salt);
});

ipcMain.handle('set-encryption-service', (event, masterPassword) => {
    encryptionService = new EncryptionService(masterPassword);
    return true;
});

//endregion


//setting up masterpassword
ipcMain.handle('set-master-password', async (event, masterPassword) => {
    try {
        const hashedPassword = await argon2.hash(masterPassword);
        const passwordFilePath = path.join(__dirname, 'password-store.json');
        const passwordData = { hashedPassword };


        fs.writeFileSync(passwordFilePath, JSON.stringify(passwordData));

        return true;
    } catch (error) {
        console.error("Error setting master password:", error);
        return false;
    }
});

//generate secure password
ipcMain.handle('generate-password', async () => {
    try {
        const length = 16;
        return crypto.randomBytes(length).toString('base64').slice(0, length); // Generate password
    } catch (error) {
        console.error("Error generating password:", error);
        return false;
    }
});



//region db

//setting up masterpassword
ipcMain.handle('db-save-login', async (event, dto) => {
    try {
        console.log("DTO inside main");
        console.log(dto);
        console.log("test test test test");

        db.run(`INSERT INTO logins (website, username, password, iv, tag, salt) VALUES (?, ?, ?, ?, ?, ?)`,
            [dto.website, dto.username, dto.encryptedData, dto.iv, dto.tag, dto.salt], (err) => {
                if (err) {
                    console.error('Error inserting data: ', err);
                }
            });
    } catch (error) {
        console.error('Encryption error: ', error);
    }
});

ipcMain.handle('db-retrieve-login', async () => {
    return new Promise((resolve, reject) => {
        db.all(`SELECT website, username, password, iv, tag, salt FROM logins`, [], (err, rows) => {
            if (err) {
                console.error('Error retrieving logins:', err);
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
});
//endregion db
