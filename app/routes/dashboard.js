// note_routes.js
var auth = require('../../auth/auth');
var express = require('express');
var router = express.Router();
var db = require('../../db');
var mongo = require('mongodb');

router.get('/attendance', (req, res, next) => {
    var token = req.header("authorization");
    var email = req.header("email");
    var collection = db.get().collection(""+email);
    console.log("authorization"+token);    
    console.log("email"+email);
    collection.find({ email: email, token: token }).toArray((err, docs) => {
        if (err) {
            res.send({ 'error': 'An error has occurred' });
            console.log("error at get " + err);
        }
        else {
            console.log("Response"+docs);
            res.send(docs);
        }
    });

});

router.post('/attendanceUpdate',(req,res,next)=>{
    var collection = db.get().collection(req.body.email);
    var o_id = new mongo.ObjectID(req.body._id);
    console.log(req.body._id+" "+req.body.email+"  "+req.body.Date+"  "+req.body.work+" ");
    collection.update(
        {'_id': o_id}, { 'email': req.body.email,"Date": req.body.Date, 
        "StartTime": req.body.StartTime, 'token': req.header("authorization"),
        "EndTime": req.body.EndTime, "work":req.body.work },
         (err, result) => {
            if (err) {
                res.send({ 'status': 'An error has occurred' });
                console.log("error at get " + err);
            }
            else {
                var arr = {
                    "status": "success"
                };
                console.log(JSON.stringify(result));
                res.send(arr);
            }
         });
});
router.post('/attendance', (req, res, next) => {
    var collection = db.get().collection(req.body.email);
    
    collection.insert({
        "email": req.body.email, "Date": req.body.Date, "StartTime": req.body.StartTime,
        "EndTime": req.body.EndTime, "work":req.body.work, "token": req.header("authorization")
    }, (err, result) => {
        if (err) {
            res.send({ 'status': 'An error has occurred' });
            console.log("error at get " + err);
        }
        else {
            var arr = {
                "status": "success"
            };
            res.send(arr);
        }
    });
});

module.exports = router;