module.exports = {
    database: 'mongodb+srv://xxxxxx:xxxxxx@xxxxxx0-xxxxxx.mongodb.net/users?retryWrites=true&w=majority', // the users database
    allobjdb: 'mongodb+srv://xxxxxx:xxxxxx@xxxxxx0-xxxxxx.mongodb.net/allObjects?retryWrites=true&w=majority', // the objects database
    secret: 'xxxxxxx', // used for user auth token
    forgotpwdkey: 'xxxxxxx' // used for link token to be send
}
