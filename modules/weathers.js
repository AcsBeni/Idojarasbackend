const express = require('express');
const router = express.Router();

const{users,weathers, GetnextId, Saveweather, isDateValid,} = require("../utils/store")

//--------------------------------Időjárás Lekérdezések----------------------------------------

//Minden időjárás adatának kiírása
router.get("/",(req, res) => {
    res.send(weathers);
  });
  //Időjárás kigyűjtése felhasználó id alapján
  router.get("/user/:uid",(req, res) => {
    let uid = req.params.uid;
    let idx = users.findIndex(user => user.id == uid);
    if (idx==-1) {
      return res.status(400).send("Nincs ilyen id-jű user" );
    }
    res.send(weathers.filter(weather => weather.userid == uid));
  });
  //új időjárás
  router.post("/",(req, res) =>{
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
  router.patch("/:id",(req, res) => {
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
  router.delete("/:id",(req, res) => {
    let id = req.params.id;
    let idx = weathers.findIndex(weather => weather.id == id);  
    if (idx>-1) {
      weathers.splice(idx,1);
      Saveweather();
      return res.send(weathers);
    }
  })
  module.exports = router