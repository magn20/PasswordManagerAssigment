const crypto = require('crypto');
const argon2 = require('argon2');

class EncryptionService {
    constructor(masterPassword) {
        this.masterPassword = masterPassword;
        this.decryptionKey = null;
        this.encryptionKey = null;
    }

    // derive used key for decryption
    async deriveKey(salt) {
        // Derive a key using PBKDF2
        this.decryptionKey = crypto.pbkdf2Sync(
            this.masterPassword,
            Buffer.from(salt, 'hex'),
            100000, // iterations
            32, // key length in bytes
            'sha256' // hash function
        );
        return this.decryptionKey; // Return the derived key as a Buffer
    }

    //genarete a new encryptionkey
    async generateKey() {
        const salt = crypto.randomBytes(16).toString('hex');


        this.encryptionKey = crypto.pbkdf2Sync(
            this.masterPassword,
            Buffer.from(salt, 'hex'),
            100000, //refactor magicnumbers aways
            32,
            'sha256'
        );

        console.log('Generated Key:', this.encryptionKey);
        console.log('Key Length:', this.encryptionKey.length);

        return { key: this.encryptionKey, salt };
    }

    // Function to encrypt data
    async encrypt(plaintext) {
        const { key, salt } = await this.generateKey();

        const iv = crypto.randomBytes(16);
        const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);

        let encrypted = cipher.update(plaintext, 'utf8', 'hex');
        encrypted += cipher.final('hex');
        const tag = cipher.getAuthTag();

        return {
            iv: iv.toString('hex'),
            encryptedData: encrypted,
            tag: tag.toString('hex'),
            salt: salt
        };
    }

    // decrypt data
    async decrypt(encryptedData, iv, tag, salt) {
        const key = await this.deriveKey(salt);

        const decipher = crypto.createDecipheriv('aes-256-gcm', key, Buffer.from(iv, 'hex'));
        decipher.setAuthTag(Buffer.from(tag, 'hex'));

        let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        return decrypted;
    }
}

module.exports = EncryptionService;
