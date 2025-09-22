const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
var cors = require('cors');
//-------------------middleware--------------
app.use(cors());
app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 


let users=[];
let weather=[];
const USERS_FILE=path.join(__dirname,'users.json')
const WEATHER_FILE=path.join(__dirname,'weather.json')


//-------------remindergithub----
/*
npm init
git add .
git commit -m "commit lett"
git push -u origin main      
*/
//--------------------------------User lekérdezések----------------------------------------

app.get("/",(req, res) => {
    res.send('hello');
});