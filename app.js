const express = require('express');
const bodyParser = require('body-parser');
const mongodb = require('mongodb');
const assert = require('assert');
const uuid = require('uuid/v1');

var app = express();
app.use(bodyParser.json());

app.use(
  bodyParser.urlencoded({
    extended: true
  })
);

const PORT = 3000;

var MongoClient = mongodb.MongoClient;
var db;

MongoClient.connect("mongodb://mongo:27017/blabber", { useNewUrlParser: true }, (err, database) => {
  //console.log('connected');
  assert.equal(null, err);
  db = database.db("blabber");

  //console.log(db);

  app.listen(PORT, () => {
    console.log('Now listening on port ' + PORT);
  });
});

function BlabModel (id, postTime, author, message) {
  this.id = id;
  this.postTime = postTime;
  this.author = author;
  this.message = message;
}

app.get('/blabs', (req, res) => {
  //console.log('get');
  var time = req.query.createdSince;
  if (!time) {
    time = 0;
  }
  console.log("TIME: " + time);
  var query = {postTime: { $gte: time}};

  var ret = db.collection("blabber").find(query, (err, result) => {
    assert.equal(null, err);
    //res.status(200).send(result);
  })
  if (ret == null) {
    res.status(200).send([]);
  } else {
    res.status(200).send(ret.toArray());
  }
});


app.post('/blabs', (req, res) => {
  //console.log('post');
  if (!req.body.author) {
    return res.status(400).send({
      success: 'false',
      message: 'Author is required'
    });
  }
  if (!req.body.message) {
    return res.status(400).send({
      success: 'false',
      message: 'Message is required'
    });
  }

  var date = new Date();
  const blab = new BlabModel(uuid(), Math.floor(date.getTime() / 1000), req.body.author, req.body.message);
  db.collection("blabber").insertOne(blab, (err, result) => {
    assert.equal(null, err);
    //console.log(blab);
    res.status(201).send(blab);
    // setTimeout(() => {
    //   res.status(201).send(blab);
    // }, 2000);
  });
});


app.delete('/blabs/:id', (req, res) => {
  var currId = req.params.id.toString();
  var query = {id: currId};
  var hasDeleted = false;
  db.collection("blabber").deleteOne(query, function(err, docs) {
    assert.equal(null, err);
    hasDelete = true;
    res.status(200).send("Blab deleted Successfully");
  });
  if (!hasDeleted) {
    res.status(404).send("Blab not found");
  }
});
