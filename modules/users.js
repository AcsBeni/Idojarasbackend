const express = require('express');
const router = express.Router();

const{users, GetnextId, Saveusers, isEmailValid} = require("../utils/store")


//--------------------------------User lekérdezések----------------------------------------

router.get("/",(req, res) => {
    res.send('Ács Benjámin Időjárás fullstack');
});
//Get all users
router.get("/",(req, res) => {
 
    res.send(users );
});
//new user
router.post("/",(req, res) =>{
    let data = req.body;
    if(isEmailValid(data.email)) {
        return res.status(400).send({msg: "Már létező email cím"});
    }
    data.id = GetnextId("user");
    users.push(data);
    Saveusers(users);
    res.send({msg: "Sikeres regisztráció"});
})
//user keresése id alapján
router.get("/:id",(req, res) => {
    let id = req.params.id
    let idx = users.findIndex(user=>user.id ==id)
    if(idx>-1){
      return(res.send(users[idx]))
    }
    return "Nincs ilyen id-s user"
});
//felhasználó bejelentkezése
router.post("/login", (req,res) =>{
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
router.delete("/:id",(req, res) => {
  let id = req.params.id;
  let idx = users.findIndex(user => user.id == id);  
  if (idx>-1) {
    users.splice(idx,1);
    Saveusers(users);
    return res.send(users);
  }
})
//Email változtatása
router.patch('/profile/:id', (req, res) => {
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
      Saveusers(users)
      return res.send(users[idx])
  }
  return res.status(400).send("Nincs ilyen azonosítójú felhasználó!")
})
//Jelszó változtatás
router.patch('/password/:id', (req, res) => {
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
          Saveusers(users)
          return res.send(users[idx])
      }
      return res.status(400).send({ msg: "Nincsenek meg a szükséges adatok!" })
  }
  return res.status(400).send({ msg: "Nincs ilyen azonosítójú felhasználó!" })
})
module.exports= router