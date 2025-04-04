const express = require('express');
const app = express();
const port = 3000;
require('dotenv').config();
const db = require('./db');


const bodyParser = require('body-parser');
app.use( bodyParser.json());
const PORT = process.env.PORT || 3000;
const {jwtAutMiddleware} = require('./jwt');

app.get('/',(req,res)=>{
console.log("well come to voting app");
res.status(200).json('well come to India voting app')
})


const userRoutes = require('./routes/userRoutes');
const candidateRoutes  = require('./routes/candidateRoutes');
app.use('/user',userRoutes);
app.use('/candidate',candidateRoutes);

app.listen(3000,()=>{
    console.log("app is listing on 3000")
})