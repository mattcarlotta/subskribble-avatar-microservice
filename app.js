require('@babel/register');
const express = require('express');

const app = express();

require('./middlewares')(app);
require('./routes')(app);
require('./server')(app);
