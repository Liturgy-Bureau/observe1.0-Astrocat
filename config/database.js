module.exports = {
    database: 'mongodb+srv://liturgy:litworker369@liturgy0-opnag.mongodb.net/users?retryWrites=true&w=majority', // the users database
    allobjdb: 'mongodb+srv://liturgy:litworker369@liturgy0-opnag.mongodb.net/allObjects?retryWrites=true&w=majority', // the objects database
    secret: 'xxxxxxx', // used for user auth token
    forgotpwdkey: 'xxxxxxx' // used for link token to be send
}
