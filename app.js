const express = require('express');
const bodyParser = require('body-parser');
const mongodb = require('mongodb');
const assert = require('assert');

var app = express();
app.use(bodyParser.json());


const PORT = 3000;

var MongoClient = mongodb.MongoClient;
var db;

MongoClient.connect("mongodb://mongo:27017", { useNewUrlParser: true }, function(err, database) {
  console.log('connected');
  if(err) return console.error(err);
  db = database;

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
  var time = req.query.createdSince;
  if (time) {
    console.log('found');
    var query = {postTime: { $gt: time}};

    db.collection("replicaset_mongo_client_collection")
      .find(query, function(err, result) {
      
      assert.equal(null, err);

      docs.each(function(err, docs) {
        if(docs) {
          res.status(201).send(docs);
        }
        else {
          res.status(201).send(docs);
        }
      });
    });
  } else {
    console.log('found2');
  }
});


app.post('/blabs', (req, res) => {
  console.log('post');
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
  const blab = new BlabModel(currId.toString(), date.getTime() / 1000, req.body.author, req.body.message);
  currId++;
  db.collection("replicaset_mongo_client_collection").insert([blab], function(err, result) {
    assert.equal(null, err);

    docs.each(function(err, docs) {
      if(docs) {
        res.status(201).send(docs);
      }
      else {
      }
    });
  });
});


app.delete('/blabs/:id', (req, res) => {
  var currId = req.params.id.toString();
  
  var query = {id: currId};
  //var query = {};
  db.collection("replicaset_mongo_client_collection").remove(query, function(err, docs) {
    assert.equal(null, err);
    docs.each(function(err, docs) {
      if(docs) {
        res.status(201).send(docs);
      }
      else {
        res.status(404).send({message: 'Blab not found'});
      }
    });
  });
});
