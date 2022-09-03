const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const config = require('../config/database');
//const socket = require('../socket-srv/sockets');

/* ---------------- START EVERY DATABASE CONECTIONS THE MODELS USE ----------------------*/
/* ---------------------------- CONNECT TO TO USERS DATABASE --------------------------- */
const connUser = mongoose.createConnection(config.database, { useNewUrlParser: true, useUnifiedTopology: true });
// on mongoose connection
connUser.on('connected', (err) =>{
    console.log('USERS MODELS connected to USERS database as connUser client' + '\n' + config.database);
});
// on error
connUser.on('error', (err) =>{
    console.log('user database error') + err;
});
/* ----------------------------------------------------------------------------------- */

// A general User Schema 
const UserSchema = mongoose.Schema({
    fullname: {type: String},
    email: {type: String, required: true},
    password: {type: String, required: true},
    phone: {type: String },
    company: {type: String },
    title: {type: String},
    address: {type: String},
    country: {type: String},
    linkedobj:{type: Array},
    userstatistics: {type: Object},
    userpreferences: {type: Object},
    sockets: {type: Object},
    misc: {type: Object},
});

const User = module.exports = connUser.model('User', UserSchema); // export the model to be used in other modules

// ================= USER REST FUNCTIONS ================= //

// GET USER BY ID FUNCTION
module.exports.getUserById = function(id, callback){
    User.findById(id, callback);
}

// GET USER BY EMAIL (THE ACTUAL ID THE APPLICATION USES)
module.exports.getUserByEmail = function(email, callback){
    const query = {email: email}
    User.findOne(query, callback);
}

// ADD A NEW USER - IN REGISTRATION
module.exports.addUser = function(newUser, callback){
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser.userstatistics = 
            {
            'initialregistrationdate': Date.now(toString),
            'role': 'member',
            'billingstatus': 'warnings',
            'objectsstatus': 'warnings'}
            newUser.userpreferences = {
            'haspreferences': false
            }                           
            newUser.misc = {
            'avatar': false
            }                          
            newUser.save(callback);
        });
    });
}

// COMPARE PASSWORD WITH BCRYPT - AT THE LOGIN PHASE
module.exports.comparePassword = function(candidatePassword, hash, callback){
    bcrypt.compare(candidatePassword, hash, (err, isMatch) => {
        if(err) throw err;
        callback(null, isMatch);
    });
}

// CHANGE THE USER PASSWORD AND HASHES IT
module.exports.changePassword = function(newPassword, user, callback){
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newPassword, salt, (err, hash) => {
            if (err) throw err;
            User.findOneAndUpdate({email: user.email}, {password: hash}, {useFindAndModify: false}, callback);
        });
    });
}

// =============== UTILITY FUNCTIONS ================ //

// UPDATE USER LOGIN -LAST- DATE
module.exports.updateLoginDate = function(usermail, newDate,){
    User.findOneAndUpdate({email: usermail}, {'userstatistics.lastlogindate': newDate}, {useFindAndModify: false}, function(err, result){});
}

// CHANGE USER AVATAR
module.exports.changeMyAvatar = function(usermail, newAvatar, callback){
    User.findOneAndUpdate({email: usermail}, {'misc.avatar': newAvatar}, {useFindAndModify: false}, callback);
}

// =============== SOCKETS FUNCTIONS =============== //

module.exports.getUserByUid = function(id, callback){
    User.findById(id, callback);
    // console.log(id);
}

// WATCH DB
module.exports.dbWatcher = (socket, io) => {
    const changeStream = connUser.watch({fullDocument: 'updateLookup'}).on('change', data => {
        switch(data.operationType) {
            case 'update': io.of('/admin').emit('hi', data);
            break;
            case 'insert': console.log(data);
            break;
            case 'delete': console.log(data);
            break;
            
          }
    }); 
}
