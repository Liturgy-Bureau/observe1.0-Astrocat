const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database');
const apihelper = require('../config/apis');

const mailer = require('nodemailer');
const { google } = require('googleapis');
const OAuth2 = google.auth.OAuth2;

const User = require('../models/user-model');
const Object = require('../models/object-model');

// ============ ROUTES THAT HANDLE REGISTRATION REQUESTS GOES HERE ============//
// Register
router.post('/register', (req, res, next) => {

    // res.send('REGISTER');
    // const fullname = req.body.fullname;
    const email = req.body.email;

    User.getUserByEmail( email, (err, user) => {
        if(err) throw err;
        if(user) {
            res.json({success: false, msg: 'user already exists!'})
        } else {
            let newUser = new User({
            fullname: req.body.fullname,
            email: email,
            password: req.body.password,
            phone: req.body.phone,
            company: req.body.company,
            title: req.body.title,
            address: req.body.address,
            country: req.body.country,
            userstatistics: req.body.userstatistics,
            userpreferences: req.body.userpreferences
            });

            User.addUser(newUser, (err, user) => {
                if (err){
                    res.json({success: false, 
                              msg: 'meowing lost in another galaxy! failed to register user!'})
                } else {
                    res.json({success: true, 
                              msg: 'great launch! user succesfully created!'})
                }
            });
        }
    });

    
});

// ============ ROUTES THAT HANDLE AUTHENTICATION REQUESTS GOES HERE ============//
// Authenticate
router.post('/authenticate', (req, res, next) => {
    // res.send('AUTHENTICATE');
    const email = req.body.email;
    const password = req.body.password;

    User.getUserByEmail(email, (err, user) => {
        if(err) throw err;
        if(!user){
            return res.json({success: false, 
                             msg: 'could not locate this space traveller!'});
        }
        User.comparePassword(password, user.password, (err, isMatch) => {
            if(err) throw err;
            // console.log('route says: ', {fullname: user.fullname, _id: user._id});
            if(isMatch){
                const token = jwt.sign({fullname: user.fullname, _id: user._id}, config.secret, {
                    expiresIn: 86400 // 24 hours
                });
                res.json({
                    success: true,
                    token: 'JWT ' + token,
                    user: {
                        id: user._id,
                        fullname: user.fullname,
                        avatar: user.misc.avatar   
                    },
                    msg: 'you are onboard!'
                });
                User.updateLoginDate(email, Date.now());
            } else {
                return res.json({success: false, 
                                 msg: 'wrong password you astrocat!'})
            }
        });
    });
});

// Forgot password - PHASE (1)
// send email with 6 minutes expiration token
router.post('/missings/auth/forgotpwd', (req, res, next) => {
    // res.send('FORGOT');
    const email = req.body.email;
    User.getUserByEmail(email, (err, user) => {
        if(err) throw err;
        if(!user){
            return res.json({success: false, 
                             msg: 'User not found!'});
        } else {
            const token = jwt.sign({usermail2reset: user.email}, config.forgotpwdkey, {expiresIn: 3600});
            // ---- GENERATE MAIL CARRIER AND SEND MAIL ---- //
            async function mailsender(){
                const carrier = mailer.createTransport({
                    service: 'gmail',
                    auth: {
                        type: 'OAuth2',
                        user: apihelper.email,
                        clientId: apihelper.client_id,
                        clientSecret: apihelper.client_secret,
                        refreshToken: apihelper.refresh_token,
                        accessToken: apihelper.access_token
                    }
                });
                const mailInfo = await carrier.sendMail({
                    from: '"Liturgy Cons. Service" <bureau@litcons.eu>',
                    to: user.email,
                    subject: 'password reset for observe application',
                    text: '',
                    html: '<h3>hi there <b>' + user.fullname + '!</b></h3><br>' + 
                          '<h4>please follow the link below to reset your password:</h4><br>' +
                          '<p><a href="http://localhost:4200/reset/' + token + '"><b>reset my password link</b></a></p>' + '<br>' +
                          '<h3>the link will be active for <b>1 hour</b></h3><br>' +
                          '<p><b>have a very nice day!</b></p>'
                });
    
                console.log("Message sent: %s", mailInfo.messageId);
                console.log("Preview URL: %s", mailer.getTestMessageUrl(mailInfo));
            };
            mailsender().catch(console.error);
            res.json({success: true,
                      msg: 'an email has been sent now to ' + user.email});
            // --------------------------------------------- //
        }
    });
});

// Forgot password - PHASE (2)
// check if token is active or expired
router.get('/missings/auth/forgotpwd/:token', (req, res, next) => {
    // res.send('AUTH/FORGOTPWD/:TOKEN');
    jwt.verify(req.params.token, config.forgotpwdkey, function (err, decoded){
        if (err) {
            res.json({success: false,
                      msg: 'invalid password reset request, possibly an expired one'});
        } else {
            res.json({success: true,
                      token: req.params.token,
                      msg: 'reset proceeds for account: ' + decoded.usermail2reset,
                      user: decoded.usermail2reset});
        }
    });
});

// Forgot password - PHASE (3)
// finally reset the specific user - taken from token - password
router.post('/missings/auth/forgotpwd/reset', (req, res, next) => {
    // res.send('AUTH/FORGOTPWD/RESET');
    const newPassword = req.body.newpassword;
    const usermail = jwt.decode(req.body.usertoken, config.forgotpwdkey);
    User.getUserByEmail(usermail.usermail2reset, (err, user) => {
        if(err) throw err;
        if(!user){
            return res.json({success: false, 
                             msg: 'User not found!'});
        } else {
            User.changePassword(newPassword, user, (err, wasReset) =>{
                if(err) throw err;
                if(wasReset){
                    res.json({success: true,
                        msg: 'password was reset!'});
                } else {
                    res.json({
                        success: false,
                        msg: 'could not change password'});
                }
            });
        }
    });
});


// Profile Getter - reads the logged in user
router.get('/profile', passport.authenticate('jwt', {session: false}), (req, res, next) => {
    if(req.user){
        var userResponse = req.user;
        // console.log(userResponse);
        // userResponse.password = undefined; // No need to response with password inside
        // console.log(userResponse);
        res.json({success: true,
                 user: userResponse,
                 msg: 'user profile resolved'});
    } else {
        res.json({success: false,
                  user: 'astrodusted',
                  msg: 'unable to resolve user'});
    }
    
    //console.log(req.user.userstat.initialRegistration);
});

// ================= TEST ROUTES!!! TO GLOBALLY COMMENT OUT =============== //

/*
// Validate
router.get('/validate', (req, res, next) => {
    res.send('VALIDATE');
});
*/

// test GET request
router.get('/testget', /* passport.authenticate('jwt', {session: false}),*/ (req, res, next) => {
    // res.send('');
    const condition = req.body.condition;
    if(condition){
        res.json({
                  success: true,
                  endpoint: 'testget',
                  msg: 'testget responded SUCCESS'});
    } else {
        res.json({success: false,
                  endpoint: 'testget',
                  msg: 'testget responded ERROR'});
    }
});

// test POST request
router.post('/testpost', /* passport.authenticate('jwt', {session: false}),*/ (req, res, next) => {
    // res.send('');
    const condition = req.body.condition;
    if(condition){
        res.json({
                  success: true,
                  endpoint: 'testpost',
                  msg: 'testpost responded SUCCESS'});
    } else {
        res.json({success: false,
                  endpoint: 'testpost',
                  msg: 'testpost responded ERROR'});
    }
    
});
// ======================================================================== //



module.exports = router;