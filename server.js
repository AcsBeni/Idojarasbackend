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
let weathers=[];
const USERS_FILE=path.join(__dirname,'users.json')
const WEATHERS_FILE=path.join(__dirname,'weathers.json')

loadusers();
loadweathers();

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
    data.id = GetnextId("user");
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
//Email változtatása
app.patch('/users/profile/:id', (req, res) => {
  let id = Number(req.params.id)
  let data = req.body
  let idx = users.findIndex(user => Number(user.id) === id)
  if (idx > -1) {
      if (data.email && data.email != users[idx].email) {
          const existing = users.find(u => u.email === data.email && u.id != id);
          if (existing) {
              return res.status(400).json({ msg: "Ez az email már foglalt!" });
          }
          users[idx].email = data.email
      }
      if (data.name) users[idx].name = data.name
      Saveusers()
      return res.send(users[idx])
  }
  return res.status(400).send("Nincs ilyen azonosítójú felhasználó!")
})
//Jelszó változtatás
app.patch('/users/password/:id', (req, res) => {
  let id = Number(req.params.id)
  let data = req.body
  let idx = users.findIndex(user => Number(user.id) === id)
  if (idx > -1) {
      if (data.oldpass && data.newpass) {
          if (data.oldpass != users[idx].password) {
              return res.status(400).send("Hibás jelenlegi jelszó!")
          }
          if (data.newpass === users[idx].password) {
              return res.status(400).send("Az új jelszó nem lehet ugyanaz, mint a régi!")
          }
          users[idx].password = data.newpass
          Saveusers()
          return res.send(users[idx])
      }
      return res.status(400).send({ msg: "Nincsenek meg a szükséges adatok!" })
  }
  return res.status(400).send({ msg: "Nincs ilyen azonosítójú felhasználó!" })
})
//--------------------------------Időjárás Lekérdezések----------------------------------------
//Minden időjárás adatának kiírása
app.get("/weather",(req, res) => {
  res.send(weathers);
});
//Időjárás kigyűjtése felhasználó id alapján
app.get("/weather/user/:uid",(req, res) => {
  let uid = req.params.uid;
  let idx = users.findIndex(user => user.id == uid);
  if (idx==-1) {
    return res.status(400).send("Nincs ilyen id-jű user" );
  }
  res.send(weathers.filter(weather => weather.userid == uid));
});
//új időjárás
app.post("/weather",(req, res) =>{
  let data = req.body;
  if(isDateValid(data.date)) {
    return res.status(400).send({msg: "Már létező dátum"});
  } 
  data.id = GetnextId("weather");
  weathers.push(data);
  Saveweather();
  res.send({msg: "Sikeres Időjárás"});
})
//Időjárás szerkesztése
app.patch("/weather/:id",(req, res) => {
  let id = req.params.id;
  let data = req.body;
  let idx = weathers.findIndex(weather => weather.id == id);
  if (idx>-1) {
    
    weathers[idx] = data;
    weathers[idx].id = Number(id);
    Saveweather();
    return res.send(weathers[idx] );
  }
  return res.status(400).send("Nincs ilyen id-jű lépésszám" );
});
//Időjárás kitörlése id alapján
app.delete("/weather/:id",(req, res) => {
  let id = req.params.id;
  let idx = weathers.findIndex(weather => weather.id == id);  
  if (idx>-1) {
    weathers.splice(idx,1);
    Saveweather();
    return res.send(weathers);
  }
})

//--------------------------------functions---------------------------------------------

function Saveusers(){
    fs.writeFileSync(USERS_FILE,JSON.stringify(users));
}
function Saveweather(){
  fs.writeFileSync(WEATHERS_FILE,JSON.stringify(weathers))
}
function GetnextId(database){
  let nextid = 1;
  let maxid = 0;
  switch(database){
      case("weather"):
        if(weathers.length==0) {
          return nextid;
        }
        maxid=0;
        for (let i=0; i<weathers.length; i++) {
          if(weathers[i].id>weathers[maxid].id) {
            maxid = i;
          }
        }
        return users[maxid].id+1;
      case("user"):
        if(users.length==0) {
          return nextid;
        }
        maxid = 0;
        for (let i=0; i<users.length; i++) {
          if(users[i].id>users[maxid].id) {
            maxid = i;
          }
        }
        return users[maxid].id+1;
  }
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
function isDateValid(date){
  let exist = false;
  weathers.forEach(weather => {
    if(weather.date == date) {
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
function loadweathers(){
  if(fs.existsSync(WEATHERS_FILE)) {
    const raw = fs.readFileSync(WEATHERS_FILE);
    try {
      weathers = JSON.parse(raw);
    }
    catch(err) {
      console.error(err);
      weathers = [];
    }
  }
  else {
    Saveweather();
  }
}
app.listen(3000);

