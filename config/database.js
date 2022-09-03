module.exports = {
    database: 'mongodb+srv://liturgy:litworker369@liturgy0-opnag.mongodb.net/users?retryWrites=true&w=majority', // the users database
    allobjdb: 'mongodb+srv://liturgy:litworker369@liturgy0-opnag.mongodb.net/allObjects?retryWrites=true&w=majority', // the objects database
    secret: 'liturgyinnercircle', // used for user auth token
    forgotpwdkey: 'awanderingastronaut' // used for link token to be send
}