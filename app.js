const dotEnv = require('dotenv');
dotEnv.config();
const express = require('express');
const app = express();
const postRoutes = require('./api/posts');
const userRoutes = require('./api/users');
const fileRoutes = require('./api/files');
const noteRoutes = require('./api/notes');
const doctorRoutes = require('./api/doctors');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const db = require("./models/index");
const { fileParser } = require('express-multipart-file-parser');

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: true,  limit: '1600mb'}));
app.use(bodyParser.json({limit: '1600mb'}));
app.use(fileParser({
  rawBodyOptions: {
    limit: '1600mb',
  },
  busboyOptions: {
    limits: {
      fields: 100
    }
  },
}))

app.use((req,res,next)=>{
  res.header("Access-Control-Allow-Origin","*");
  if(req.method=='OPTIONS'){
    res.header("Access-Control-Allow-Methods","GET, POST, PUT,  PATCH,  DELETE, OPTIONS");
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    return res.status(200).json({});
  }
  next();
});

app.use('/posts', postRoutes);
app.use('/users', userRoutes);
app.use('/files', fileRoutes);
app.use('/notes', noteRoutes);
app.use('/doctors', doctorRoutes);

app.use((req,res,next)=>{
  let error = new Error("Not found");
  error.status = 404;
  next(error);
});

app.use((error,req,res,next)=>{
 res.status(error.status || 500).json({
   error: error.message
 })
});


module.exports = app;