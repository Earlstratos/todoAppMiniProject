// creating instance of express 
const express = require('express');
const app = express();
const cors = require("cors");

//load config and env file
require("dotenv").config();

const PORT = process.env.PORT||4000;//if the default port not work then run on 4000 

// middleware to parse json request body
app.use(express.json());
app.use(cors());

//import routes for todo api
const  auth = require("./Routes/auth");
const list = require("./Routes/list");

//mount the todo api routes
app.use("/api/v1",auth);
app.use("/api/v2",list);

// start server
app.listen(PORT,() => {
    console.log(`app is running at ${PORT}`);
})

//connect database 
const dbConnect = require("./Config/database");
dbConnect();

//default ROutes
app.get("/",(req,res) =>{
    res.send(`<h1> This is my Homepage baby</h1>`);
})