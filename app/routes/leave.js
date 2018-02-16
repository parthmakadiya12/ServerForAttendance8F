// note_routes.js
var auth = require('../../auth/auth');
var express = require('express');
var router = express.Router();
var db = require('../../db');
var mongo = require('mongodb');

router.get('/', (req, res, next) => {
    var token = req.header("authorization");
    var email = req.header("email");
    var collection = db.get().collection("" + email);
    console.log("authorization" + token);
    console.log("email" + email);
    collection.find({ email: email, token: token }).toArray((err, docs) => {
        if (err) {
            res.send({ 'error': 'An error has occurred at auth.' });
            console.log("error at get " + err);
        }
        else {
            db.get().collection("leave").find({ email: email }).toArray((err, data) => {
                if (err) {
                    res.send({ 'error': 'An error has occurred at leave' });
                    console.log("error at get " + err);
                }
                else {
                    console.log("Response" + data);
                    res.send(data);
                }
            });

        }
    });
});

router.post('/', (req, res, next) => {

    var token = req.header("authorization");
    flag = 0;
    const data = {
        email: req.body.email,
        startDate: req.body.startDate,
        endDate: req.body.endDate,
        reason: req.body.reason
    }
    console.log("Email and passwords are" + req.body.email + " " + token);
    if (token != null && data.email != null) {
        var collection = db.get().collection('signup');
        collection.find({ 'email': data.email, 'token': token }).toArray((err, docs) => {
            if (err) {
                console.log("error at get " + err);
            }
            else {
                console.log(flag + "Success finding combo. Validated" + JSON.stringify(docs));
                if (Object.keys(docs).length === 0) {
                    res.send("Error");
                }
                else {
                    //actual logic of leave here
                    var collection = db.get().collection('leave');
                    //email,sdate,edate,token
                    collection.insert(
                        {
                            'email': data.email, "startDate": data.startDate, "endDate": data.endDate, "reason": data.reason ,"status":"pending"
                        }, (err, result) => {
                            if (err) {
                                res.send({ 'status': 'Err' });
                                console.log("error at get " + err);
                            }
                            else {
                                var arr = {
                                    "status": "success"
                                };
                                res.send(arr);
                            }
                        });
                }
            }
        });
    }
    else {
        res.send('UA ACCESS');

    }
});

module.exports = router;

