var express = require('express');
var router = express.Router();

const debug = require('debug')('mongo:test');
//const User = require('../models')("User");
//const flower = require('../models')("Flower");
const prompt = require('../prompt');
const timeout = require('../timeout');
const manager = require("../models")("Manager");

router.use(express.json());
router.get("/managerArea", function (req, res) {
  res.render("managerArea");
});
router.get("/reqlist", function (req, res) {
  res.render("reqlist");
});
/*router.get("/bank.jpg", function (req, res) {
  res.sendFile('C:\project_web\client\public\image\bankk.jpg');
});*/

router.post("/loginM", async function (req, res) {
  console.log("hiiiiiiiiiiiiiiii")
  var data = req.body;
  var id_ = req.body.ID;
  let mymanager = null;
  //console.log(JSON.stringify(req.body) + " id: " + id_); 
 try{
  [mymanager ]= await manager.REQUEST({ID: id_});

 }catch (err) { console.log(`Failure ${err}`); }
  console.log(mymanager);
  if(mymanager) {
    console.log("manager found: " + mymanager);
    res.send(mymanager);   
}
    else {console.log("manager not found");
    res.send("0");}
  });


module.exports = router;
