const express = require('express');
const bodyParser = require('body-parser');

var app = express();

const PORT = 3000;

const currId = 0;

function BlabModel (id, postTime, author, message) {
  this.id = id;
  this.postTime = postTime;
  this.author = author;
  this.message = message;
}

const blabArray = [];

app.listen(PORT, () => {
  console.log('Server running on port ' + PORT);
});

// app.get('/blabs', (req, res) => {
//   console.log("get");
//   res.status(200).send({
//     success: 'true',
//     message: 'todos retrieved successfully',
//   })
// });


app.post('/blabs', (req, res) => {
  console.log("post");
  res.status(200).send({
    success: 'true',
    message: 'todos retrieved successfully',
  })
  // if (!req.body.author) {
  //   return res.status(400).send({
  //     success: 'false',
  //     message: 'Author is required'
  //   });
  // }
  // if (!req.body.message) {
  //   return res.status(400).send({
  //     success: 'false',
  //     message: 'Message is required'
  //   });
  // }
  // const blab = new BlabModel(currId, Date.now(), req.body.author, req.body.message);
  // blabArray[currId] = blab;
  // currId++;
});
