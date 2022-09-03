const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
// const mongoose = require('mongoose');
// const multer = require('multer');
const config = require('./config/database');
const { Server } = require('socket.io'); // SOCKET.IO 

const app = express();

// CORS Middleware
app.use(cors());

// Load the router files
const users = require('./routes/user-routes'); // the users router file
const objects = require('./routes/objix-routes'); // the objects router file
const images = require('./helpers/img-upload'); // the image upload router file
// const { emit } = require('process');

// Port number for Server
const port = 3000;

// Set Static Folder
app.use(express.static(path.join(__dirname, 'public')));

// Body Parser Middleware
app.use(bodyParser.json());

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

require('./config/passport')(passport); // passport usage

// Use the router files endpoints with the respective prefixes in URL
app.use('/users', users); // use the users router file contents - adds /users prefix to the actual route ex. /users + router file endpoints
app.use('/objects', objects); // use the objects router file contents - adds /objects prefix to the actual route ex. /objects + router file endpoints
app.use('/images', images); // use the images router file contents - adds /images prefix to the actual route ex. /images + router file endpoints

// Index Route
//app.get( '/', (req, res) => {
    //res.send('Invalid Endpoint!');
//});

// send all request to Angular frontend to decide the routing
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});

// Start Server - HTTP SERVER
const server = app.listen( port, () => {
    console.log('Server started on port ' + port);
});


// SOCKET.IO SERVER INITIALIZATION - SOCKETS USE THE SAME SERVER AS HTTP:
const io = new Server(server, { transports: ['websocket'], cors: { origin: '*'}}); // SOCKET.IO - ACCESS SERVER AFTER IS INITIALIZED - RIGHT ABOVE!!!

// ========= GENERAL USE / INITIALIZE SOCKETS ======== //
io.of('/').on('connection', (socket) =>{
    require('./socket-srv/sockets').genericSocket(socket, io);
});
// ==================================================== //

// ========= ADMINISTRATOR / MODERATOR SOCKETS ======== //
io.of('/admin').on('connection', (socket) => {
    require('./socket-srv/sockets').adminSocket(socket, io);
    require('./models/user-model').dbWatcher(socket, io);
});
// ==================================================== //

