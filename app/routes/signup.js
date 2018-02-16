// note_routes.js
var auth = require('../../auth/auth');
var express = require('express');
var router = express.Router();
var db = require('../../db');
var mongo = require('mongodb');
router.get('/', (req, res, next) => {
    var flag = 0;
    var emailH = req.header("email");
    var tokenH = req.header("authorization");
    if (tokenH != null && emailH != null) {
        var collection = db.get().collection('signup');
        collection.find({ 'email': emailH, 'token': tokenH }).toArray((err, docs) => {
            if (err) {
                console.log("error at get " + err);
            }
            else {
                console.log(flag + "Success finding combo. Validated" + JSON.stringify(docs));
                if (Object.keys(docs).length === 0) {
                    res.send("Error");
                }
                else {
                    var arr = {
                        "name": docs[0].name, "surname": docs[0].surname, "email": docs[0].email,
                        "mobile": docs[0].mobile, "gender": docs[0].gender, "dob": docs[0].dob, "token": docs[0].token
                    };
                    res.send(arr);
                }
            }
        });
    }
    else {
        res.send('UA ACCESS');

    }

});

router.post('/psignupchk', (req, res, next) => {
    const data = {
        email: req.body.email,
        password: req.body.password
    }
    console.log("Email and passwords are" + req.body.email + " " + req.body.password);
    var collection = db.get().collection('signup');
    collection.find({ email: data.email }).toArray((err, docs) => {
        if (err) {
            res.send({ 'error': 'An error has occurred' });
            console.log("error at get " + err);
        }
        else {
            if (docs.length != 0) {
                console.log("now check any object return or not" + docs.length + " " + JSON.stringify(docs));
                //res.send(docs); never send all data without encrypted
                if (1) {
                    console.log("salt at signup" + JSON.stringify(docs[0].salt));
                    var x = auth.saltHashPassword(req.body.password, docs[0].salt);
                    console.log("pass from db " + JSON.stringify(docs[0].password + " from user encry " + x.passHash));
                    if (x.passHash == docs[0].password) {
                        console.log("Login Success");
                        var arr = {
                            "name": docs[0].name, "surname": docs[0].surname, "email": docs[0].email,
                            "mobile": docs[0].mobile, "gender": docs[0].gender, "dob": docs[0].dob,
                            "token": docs[0].token, "status": "success"
                        };
                        res.send(arr);
                    }
                    else {
                        res.send({ "status": "invalid User" });
                    }
                }
            }
            else {
                res.send({ "status": "invalid User" });
            }
        }
    });
});

router.post('/psignup', (req, res, next) => {
    console.log("name 0 " + req.body.name + req.body.password);
    var x = auth.saltHashPassword(req.body.password);
    console.log("x " + JSON.stringify(x));
    console.log(x.passHash + " and " + x.salt + " and " + x.token);
    const data = {
        name: req.body.name,
        surname: req.body.surname,
        email: req.body.email,
        mobile: req.body.mobile,
        password: x.passHash,
        gender: req.body.gender,
        dob: req.body.dob,
        salt: x.salt,
        token: x.token
    };
    if (1) {
        //req.body.name != null && req.body.surname != null && req.body.email != null && req.body.mobile != null && req.body.password != null && req.body.gender != null  && req.body.dob != null
        console.log("No Empty fileds - all ok at post signup");
        var collection = db.get().collection('signup');
        collection.insert(data, (err, result) => {
            if (err) {
                res.send({ 'error at post': 'An error has occurred' });
                console.log("error " + err);
            } else {
                var arr = {
                    "status": "success", "email": result.ops[0].email, "token": result.ops[0].token
                };
                res.send(arr);
            }
        });
    }
    else {
        res.send("Empty Field");
    }

});

module.exports = router;