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

MongoClient.connect("mongodb://mongo:27017", { useNewUrlParser: true }, (err, database) => {
  //console.log('connected');
  assert.equal(null, err);
  db = database.db("blabber");

  db.createCollection('blabber', function(err, collection) {});
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
  console.log('get');
  var time = 0;
  if (req.query.createdSince) {
    time = parseInt(req.query.createdSince);
  }
  var query = {postTime: { $gte: time}};
  //console.log("using query", query);

  db.collection("blabber").find(query).toArray((err, result) => {
    assert.equal(null, err);
    res.status(200).send(result);
  })

  // Change time to int (cast with parseint) DONE

  // make a new docker compose for tests without volumes
  // fix 404 error for delete, call get before and if doesnt exist, return 404

});


app.post('/blabs', (req, res) => {
  // console.log('post');
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
  db.collection("blabber").find(query, (err, result) => {
    if (result == null) {
      res.status(404).send("Blab not found");
    }
  });
  db.collection("blabber").deleteOne(query, (err, result) => {
    assert.equal(null, err);
    res.status(200).send("Blab deleted Successfully");
  });
});
