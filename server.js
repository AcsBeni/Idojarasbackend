const express = require('express');
const app = express();
var cors = require('cors');
const {Initstore} = require ('./utils/store')

const Userroutes = require("./modules/users")
const Weatherroutes = require("./modules/weathers")


//-------------------middleware--------------
app.use(cors());
app.use(express.json()); //json formátum megkövetelése
app.use(express.urlencoded({ extended: true })); //req.body használata

//-------------remindergithub----
/*
npm init
git add .
git commit -m "commit"
git push -u origin main      
*/
Initstore();

app.get("/",(req, res) => {
    res.send('Ács Benjámin Időjárás fullstack');
});
app.use("/users", Userroutes)
app.use("/weather", Weatherroutes)

app.listen(3000);

