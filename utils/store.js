const fs = require('fs');
const path = require('path');

const USERS_FILE=path.join(__dirname,'..',"database", "users.json")
const WEATHERS_FILE=path.join(__dirname,'..',"database","weathers.json")

let users=[];
let weathers=[];

loadusers();
loadweathers();

// -----------------------------------Functions------------------------------------

function Initstore(){
    loadusers();
    loadweathers();
}
function Saveusers(users){
    fs.writeFileSync(USERS_FILE,JSON.stringify(users));
}
function Saveweather(weathers){
  fs.writeFileSync(WEATHERS_FILE,JSON.stringify(weathers))
}
function GetnextId(table){
  
    let nextID = 1;
    if (table.length == 0){
        return nextID;
    }
    let maxindex = 0
    for (let i = 1; i < table.length; i++) {
        if (table[i].id > table[maxindex].id) {
            maxindex = i;     
        }
    }
    return table[maxindex].id + 1;
}
//ellenőrzi hogy van-e ilyen Email
function isEmailValid(email) {
  let exist = false;
  users.forEach(user => {
    if(user.email == email) {
        exist = true;
    }
  });
  return exist;
}
//ellenőrzi hogy van-e ilyen dátum
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
      Saveusers(users);
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
module.exports={
    users,
    weathers,
    Initstore,
    GetnextId,
    Saveusers,
    Saveweather,
    loadusers,
    loadweathers,
    isDateValid,
    isEmailValid

}