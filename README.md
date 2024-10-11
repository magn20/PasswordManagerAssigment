# Security assigment password manager

Local Desktop application for storing password to all your favorites sites

## Authors

- [@magn20](https://www.github.com/magn20)

## libaries
- Argon2
- Sqlite3
- Electron

# How to run
npm install

npm start 

# Images

- [images](https://github.com/magn20/PasswordManagerAssigment/tree/main/passwordmanager/images)


# Design descions


System design

this project have been made with electron using html5 and javascript i could have attached a frontend framework like vue or react but because of the scale of application i felt that wasnt needed when i started ups. 

requirement to run this project is node.js and use an ide & package manager of your choice as all getting started guides say 

do an npm install to fetch all the many lovely packages this project uses. 

afterwards use the command npm start 
this will run the start script and launch the desktop application


-------------------------------------------------------------------------------------------


I decided to use a master password thats hashed with random salt using argon2 for logging in to the desktop application.

For encryption off our passwords i used aes-256-gcm using pbkdf2Sync for password key derivation, using a salt generated with randombytes. i also generated my iv using the randombytes, I used the [Crypto](https://nodejs.org/api/crypto.html) libary for implemtation. 

Gcm allows for authentation using the generated tag wich can be used to ensure the data hasnt been changed. unlike the cbc variant of aes-256. 

After the encryption i save the login data along with the salt, iv and tag in a Sqlite3 database. 

When it comes to decryption i can reuse the salt along with the password to derive the orginal key used for encryption and use it for decryption

The iv can be used to remove pattern in chipertext as well as making the encryption more strong so even if the encryptionkey is known then you still need the iv decryption.

# pitfalls & Random considerations


Is the password known and access to the database, the passwords are not secure anymore so idealliy it would be better to have a separation of the two. or a separation of the iv and salt would also increase the security.
Since if an bad actor have access to the computer getting the access to the data would be fairly simple. And person could easily install software to obtain acess to the password so nexttime the password manager is used. 

it could also be left up for the user to decided if they wanted to run everything locally on their machine or having the logic and data stored on a server somewhere else. 

i was original also going to do session timeouts so if the progran as left alone for a longer period of time the senstive data wouldnt be left unsupervised allowing for someone to take advantages of that.
