const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const https = require('https');
const fs = require('fs');
const path = require('path');
require('dotenv').config({path: '/home/ec2-user/game-center-api/.bashrc'})
//require('dotenv').config()


const routes = require('./routes');


const PORT = process.env.PORT || 443;
const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const sslOptions = {
  key: fs.readFileSync(path.join(__dirname, 'SSL', 'key.pem')),
  cert: fs.readFileSync(path.join(__dirname, 'SSL', 'certificate.pem'))
};

if (process.env.NODE_ENV === 'production') {
	app.use(express.static(path.join(__dirname, '../client/build')));
}



app.use(routes);

mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/gameCenterDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    // Create an HTTPS server using the SSL options
    const server = https.createServer(sslOptions, app);

    server.listen(PORT, () => {
      console.log(`HTTPS server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.log('MongoDB connection error:', error);
  });
//comment