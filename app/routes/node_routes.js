// note_routes.js
var mongo   = require('mongodb');
var express = require('express');
var router  = express.Router();
var db      = require('../../db');

router.get('/:id', (req, res, next) => {
  var o_id = new mongo.ObjectID(req.params.id);
  const details = { '_id': o_id };
  var collection = db.get().collection('notes');
  collection.findOne(details, (err, item) => {
    if (err) {
      res.send({ 'error': 'An error has occurred' });
    } else {
      res.send(item);
      console.log(item);
    }
  });
});
router.post('/', (req, res, next) => {
  const note = { text: req.body.body, title: req.body.title };
  var collection = db.get().collection('notes');
  collection.insert(note, (err, result) => {
    if (err) {
      res.send({ 'error': 'An error has occurred' });
    } else {
      res.send(result.ops[0]);
    }
  });
});

module.exports = router;