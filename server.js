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

loadusers();

//-------------remindergithub----
/*
npm init
git add .
git commit -m "commit lett"
git push -u origin main      
*/
//--------------------------------User lekérdezések----------------------------------------

app.get("/",(req, res) => {
    res.send('Ács Benjámin Időjárás fullstack');
});
//Get all users
app.get("/users",(req, res) => {
 
    res.send(users );
});
//new user
app.post("/users",(req, res) =>{
    let data = req.body;
    if(isEmailValid(data.email)) {
        return res.status(400).send({msg: "Már létező email cím"});
    }
    data.id = GetnextId();
    users.push(data);
    Saveusers();
    res.send({msg: "Sikeres regisztráció"});
})
//user keresése id alapján
app.get("/users/:id",(req, res) => {
    let id = req.params.id
    let idx = users.findIndex(user=>user.id ==id)
    if(idx>-1){
      return(res.send(users[idx]))
    }
    return "Nincs ilyen id-s user"
});
//felhasználó bejelentkezése
app.post("/users/login", (req,res) =>{
    let {email, password} = req.body;
    let loggeduser = {};
    users.forEach(user =>{
      if(user.email == email && user.password == password){
        loggeduser = user
        return;
      }
    })
    res.send(loggeduser)
})
//Adatváltás email alapján
app.patch("/users/profile",(req, res) => {
  let data = req.body;
  let idx = users.findIndex(user => user.email == data.email);
  if (idx>-1) {
    users[idx] = data;
    users[idx].id = GetnextId();
    Saveusers();
    return res.send(users[idx]);
  }
});
//Adatváltás id alapján
app.patch("/users/:id",(req, res) => {
  let data = req.body;
  if(isEmailValid(data.email)) {
    return res.status(400).send({msg: "Már létező email cím"});
  }
  let id = req.params.id;
  let idx = users.findIndex(user => user.id == id);
  if (idx>-1) {
    users[idx] = data;
    users[idx].id = Number(id);
    return res.send(users[idx]);
  }
  return res.status(400).send("Nincs ilyen id-jű user" );
});
//Adat törlés id alapján
app.delete("/users/:id",(req, res) => {
  let id = req.params.id;
  let idx = users.findIndex(user => user.id == id);  
  if (idx>-1) {
    users.splice(idx,1);
    Saveusers();
    return res.send(users);
  }
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
function loadusers() {
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
      Saveusers();
    }
}
app.listen(3000);

