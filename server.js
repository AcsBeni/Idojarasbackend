const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
var cors = require('cors');
const { json } = require('body-parser');
//-------------------middleware--------------
app.use(cors());
app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 


let users=[];
let weather=[];
const USERS_FILE=path.join(__dirname,'users.json')
const WEATHER_FILE=path.join(__dirname,'weather.json')

//loadusers();

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
app.get("/users",(req, res) => {
 
    res.send(users );
});
app.post("/users",(req, res) =>{
    let data = req.body;
    if(isEmailValid(data.email)) {
        return res.status(400).send({msg: "Már létező email cím"});
    }
    data.id = getnextid();
    users.push(data);
    saveusers();
    res.send({msg: "Sikeres regisztráció"});
})
//--------------------------------User functions---------------------------------------------

function Saveusers(){
    fs.writeFileSync(USERS_FILE,JSON.stringify(users));
}
function GetnextId(){
    let nextid = 1;
    if(users.length==0) {
      return nextid;
    }
    let maxid = 0;
    for (let i=0; i<users.length; i++) {
      if(users[i].id>users[maxid].id) {
        maxid = i;
      }
    }
    return users[maxid].id+1;
}
function isEmailValid(email) {
    let exist = false;
    users.forEach(user => {
      if(user.email == email) {
        exist = true;
      }
    });
    return exist;
}
/*function loadusers() {
    if(fs.existsSync(USERS_FILE)) {
      const raw = fs.readFileSync(USERS_FILE);
      try {
        users = JSON.parse(raw);
      }
      catch(err) {
        console.error(err);
        users = [];
      }
    }
    else {
      saveusers();
    }
}*/
app.listen(3000);

