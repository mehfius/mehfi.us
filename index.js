const express = require('express');
const cors = require('cors');
const app = express();

console.log(__dirname);

app.use(express.static("./export"));
app.use(cors());
  require('./scripts/csscompact');
  require('./scripts/jscompact');
  require('./scripts/html.js');





app.get('/', (req, res) => {



});

app.listen(3000, function () {
  console.log(__dirname);
}); 
