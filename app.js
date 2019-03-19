const express = require('express');
const bodyParser = require('body-parser');

var app = express();

app.use(bodyParser.json());

const PORT = 3000;

var currId = 0;

function BlabModel (id, postTime, author, message) {
  this.id = id;
  this.postTime = postTime;
  this.author = author;
  this.message = message;
}

var blabArray = [];

app.get('/blabs', (req, res) => {
  if (!req.body.createdSince) {
    return res.status(400).send({
      success: 'false',
      message: 'createdSince is required'
    });
  }
  var i;
  for (i = 0; i < currId; i++) {
    if (blabArray[i].postTime >= req.body.createdSince) {
      res.status(200).send(blabArray.slice(i));
    }
  }
});


app.post('/blabs', (req, res) => {
  //console.log("post");
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
  const blab = new BlabModel(currId, Date.now(), req.body.author, req.body.message);
  blabArray[currId] = blab;
  currId++;
  res.status(201).send(blab);
});

app.listen(PORT, () => {
  console.log('Server running on port ' + PORT);
});