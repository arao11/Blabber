const express = require('express');
const bodyParser = require('body-parser');

var app = express();

app.use(bodyParser.json());

const PORT = 3000;

function BlabModel (id, postTime, author, message) {
  this.id = id;
  this.postTime = postTime;
  this.author = author;
  this.message = message;
}

//TODO: temporary array, need to use mongodb
var blabArray = [];
var currId = 0;

app.get('/blabs', (req, res) => {
  console.log("get");
  if (req.query.createdSince) {
    for (let i = 0; i < currId; i++) {
      if (blabArray[i].postTime >= req.query.createdSince) {
        res.status(200).send(blabArray.slice(i));
      }
    }
  }
  
  res.status(200).send(blabArray);
});


app.post('/blabs', (req, res) => {
  console.log("post");
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
  const blab = new BlabModel(currId, date.getHours(), req.body.author, req.body.message);
  blabArray.push(blab);
  currId++;
  res.status(201).send(blab);
});


app.delete('/blabs/:id', (req, res) => {
  var id = parseInt(req.params.id);
  for (let i = 0; i < currId; i++) {
    if (blabArray[i].id == id) {
      blabArray.splice(i, 1);
      return res.status(200).send({
        success: 'true',
        message: 'Blab deleted successfully'
      });
    }
  }

  return res.status(404).send({
    succes: 'false',
    message: 'Blab not found'
  })

});

app.listen(PORT, () => {
  console.log('Now listening on port ' + PORT);
});
