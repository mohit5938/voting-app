const mongoose = require('mongoose');
require('dotenv').config();

const mongooseURl = process.env.db_URL;

mongoose.connect(mongooseURl);

const db = mongoose.connection;

db.on('connected',()=>{
    console.log("connection established");
})

db.on('disconnected',()=>{
    console.log("connection is  de-established");
})

db.on('error',(e)=>{
    console.log("mongoose error",e);
})

module.exports= db;