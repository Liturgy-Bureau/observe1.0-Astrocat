const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const config = require('../config/database');

// const connectToObj = require('./user-model.js')

/* START EVERY DATABASE CONECTIONS THE MODELS USE */

/* ---------------------------- CONNECT TO TO OBJECTS DATABASE ------------------------- */
const connObj = mongoose.createConnection(config.allobjdb, { useNewUrlParser: true, useUnifiedTopology: true });
//on mongoose connection
connObj.on('connected', (err) =>{
    console.log('OBJECT MODELS connected to OBJECTS database as connObj client' + '\n' + config.allobjdb);
});
//on mongoose error
connObj.on('error', (err) =>{
    console.log('object database error') + err;
});
/* ----------------------------------------------------------------------------------- */

/* HERE BEGINS THE INTERFACE FOR THE USER AND OBJECT TO SERVER INTERACTIONS. ALL THE 
MODELS , DATABASE CONNECTIONS ETC THAT AFFECT THE OBJECT OF A USER IS HERE. */

/* ------------------ THE USER SCHEMA ------------------ */
//it is schemalles basically so leave it as an empty schema
const ObjectSchema = mongoose.Schema({any: {}});
/* ------------------------------------------------------ */

const Object = module.exports = connObj.model('Object', ObjectSchema);