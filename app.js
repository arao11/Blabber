const express = require('express');
const bodyParser = require('body-parser');
const mongodb = require('mongodb');
const assert = require('assert');
const uuid = require('uuid/v1');
const Prometheus = require('prom-client');
const fs = require('fs');

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

var username = process.env.mongoUSR;
var password = fs.readFileSync(process.env.mongoPWD).toString();

//console.log('password: ' + password);

const url = encodeURI(`mongodb://${username}:${password}@mongo:27017`)

MongoClient.connect(url, { useNewUrlParser: true }, (err, database) => {
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
    blabCounter.inc();
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

var blabCounter = new Prometheus.Counter({
  name: 'total_blabs_created_count',
  help: 'Number of blabs that have been made'
})

var collectDefaultMetrics = Prometheus.collectDefaultMetrics;
collectDefaultMetrics({ timeout: 5000 });

app.get('/metrics', (req, res) => {
  //res.status(200).send(Prometheus.register.metrics())
  const end = blabCounter.startTimer();
  res.set('Content-Type', Prometheus.register.contentType)
  res.end(Prometheus.register.metrics())
  end();

  // httpRequestDurationMicroseconds
  // .labels(req.route.path)
  // .observe(responseTimeInMs)

  // blabCounter
  // .labels(req.route.path)
  // .observe(responseTimeInMs)

  
})

var httpRequestDurationMicroseconds = new Prometheus.Histogram({
  name: 'http_request_duration_ms',
  help: 'Duration of HTTP requests in ms',
  labelNames: ['route'],
  // buckets for response time from 0.1ms to 500ms
  buckets: [0.10, 5, 15, 50, 100, 200, 300, 400, 500]
})
