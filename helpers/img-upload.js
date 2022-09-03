var express = require('express');
var router = express.Router();
const passport = require('passport');
// var multer  = require('multer'); // I WON'T USE MULTER!!!
const User = require('../models/user-model');

// I WON'T USE MULTER!!!
/*
const maxFileSize = 0.1 * 300 * 300;

const fileFilter = (req, file, cb) => {
    if (file.mimetype == 'image/jpeg' || file.mimetype == 'image/png' || file.mimetype == 'image/jpg') {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

var storage = multer.memoryStorage(); // store temporary picture in memory until it is stored in MongoDB
const upload = multer({ storage: storage, fileFilter: fileFilter, limits: {fileSize: maxFileSize} }).single('avatar');

router.post('/upload/av', passport.authenticate('jwt', {session: false}), function(req, res, next) {
    upload(req, res, function(err) {
        if(err instanceof multer.MulterError) {
        res.json({success: false,
                  endpoint: '/upload/av',
                  msg: 'file too big or wrong format!'});
        } else {
            const email = req.body.email;
            const avatar = req.file || null;
            if(!avatar) {
            res.json({success: false,
                endpoint: '/upload/av',
                msg: 'avatar possibly non existent or corrupted!'});
            } else {
                User.changeMyAvatar(email, avatar.buffer, (err, result) =>{
                    if (result === null) {
                        res.json({success: false,
                                  endpoint: '/upload/av',
                                  msg: 'non existent user'}); 
                    } else {
                        res.json({success: true,
                                  endpoint: '/upload/av',
                                  msg: 'avatar for user: ' + email + ' updated succesfully'}); 
                }
            });
          } 
        }
    });
    
});
*/
router.post('/upload/av', passport.authenticate('jwt', {session: false}), function(req, res, next) {
            const email = req.body.email;
            const avatar = req.body.avatar || null;
            if(!avatar) {
            res.json({success: false,
                endpoint: '/upload/av',
                msg: 'avatar possibly non existent or corrupted!'});
            } else {

                User.changeMyAvatar(email, avatar, (err, result) =>{
                    if (result === null) {
                        res.json({success: false,
                                endpoint: '/upload/av',
                                msg: 'non existent user'}); 
                    } else {                         
                        res.json({success: true,
                                endpoint: '/upload/av',
                                avatar: avatar,
                                msg: 'avatar for user: ' + email + ' updated succesfully'}); 
                                }
                            });
    

                
        } 
});

module.exports = router;