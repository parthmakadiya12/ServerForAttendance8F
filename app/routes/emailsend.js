var express = require('express');
var router = express.Router();
var db = require('../../db');
//var email = require("../node_modules/emailjs/email");//D:\A Js intern\AA Group Slack Class\Node js\Demo 2\samplesite\node_modules\emailjs\email.js
const nodemailer = require('nodemailer');
var crypto = require('crypto');

/* GET users listing. */
router.get('/', function (req, res, next) {

});


router.post('/', function (req, res, next) {
    var emailto = req.body.email;//req.body.email
    var sender = "verifier-donot-reply@ATManagement.com";//req.body.sender
    var random = crypto.randomBytes(Math.ceil(7 / 2)).toString('hex').slice(0, 7);
    var token = req.body.token;
    console.log("otp is " + random);
    var collection = db.get().collection('verification');
    collection.update({ 'email': emailto }, { 'email': emailto, 'token': token, 'otp': random }, { upsert: true }, (err, result) => {
        if (err) {
            console.log("error at get " + err);
        }
        else {
            var arr = {
                "email": emailto, "status": 'successEmail'
            };
            res.send(arr);
        }
    });

    let transporter = nodemailer.createTransport({
        host: 'smtp.sendgrid.net',
        port: 587,
        secure: false, // secure:true for port 465, secure:false for port 587
        auth: {
            user: 'apikey',
            pass: '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'
        }
    });
    let mailOptions = {
        from: sender, // sender address
        to: emailto, // list of receivers
        subject: 'Account Activation', // Subject line
        text: 'Welcome to AT Attendance.OTP is -->"' + random + '" ' + emailto, // plain text body
        html: 'Welcome to AT Attendance.OTP is --><b>"' + random + '"</b><br/><br/><b>' + emailto + '</b>' // html body
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message %s sent: %s', info.messageId, info.response);
    });
    //console.log("Connec ted status" + JSON.stringify(server));
    // send the message and get a callback with an error or details of the message that was sent 
    //res.send('Logic of inUsers');
});

router.post('/check', function (req, res, next) {
    var email = req.body.email;//req.body.email
    var token = req.body.token;
    var otp = req.body.otp;
    var collection = db.get().collection('verification');
    collection.find({ 'email': email, 'token': token }).toArray((err, docs) => {
        if (err) {
            console.log("error at get " + err);
        }
        else {
            console.log("Success finding combo. Validated" + JSON.stringify(docs));
            if (Object.keys(docs).length === 0) {
                res.send("Error");
            }
            else {
                if (docs[0].otp == otp) {
                    var arr = {
                        'status': "SuccessVerified"
                    };
                    var collection = db.get().collection('verification');
                    collection.remove({'email':email}, function(err, obj) {
                        if (err) throw err;
                        console.log(obj.result.n + " document(s) deleted success");
                      });
                    res.send(arr);
                }
                else {
                    var collection = db.get().collection('signup');
                    collection.remove({'email':email}, function(err, obj) {
                        if (err) throw err;
                        console.log(obj.result.n + " document(s) deleted failed");
                      });
                      res.send({'status':"Error"});
                }
            }
        }
    });
});
module.exports = router;
