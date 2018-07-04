
const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const router = require('./routes/router');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
mongoose.connect('mongodb://localhost/auth');
app.use(morgan('combined'));
app.use(cors());
app.use(bodyParser.json({ type: '*/*' }));

router(app);
const PORT = process.env.PORT || 3090;
const server = http.createServer(app);
server.listen(PORT);
console.log('server is listening on '+ PORT );
