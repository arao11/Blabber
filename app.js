const express = require('express');
const bodyParser = require('body-parser');

var app = express();

const PORT = 3000;

app.listen(PORT, () => {
  console.log('Server running on port ' + PORT);
});

app.get('/blabs', (req, res) => {
  res.status(200).send({

  })
});
