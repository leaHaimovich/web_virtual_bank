var express = require("express");
var router = express.Router();

const debug = require("debug")("mongo:test");
const prompt = require("../prompt");
const timeout = require("../timeout");
const puppeteer = require('puppeteer');
const client = require('../models')("Client");
const levcoin = require('../models')("LevCoin");
const manager = require("../models")("Manager");
//const client = require('../models/client');
var bodyParser = require('body-parser');
const { route } = require("./loansRout");
//const app = express();
const path = require('path');
router.use(express.json());
router.use(express.static(path.join(__dirname, 'public')));
router.get("/AreaHome", function (req, res) {
  res.render("clientArea");
});
router.get("/clientAreaHome", function (req, res) {
  res.render("clientAreaHome");
});

router.get("/clientInformation", function (req, res) {
  res.render("clientInformation");
});
router.get("/loans", function (req, res) {
  res.render("loans");
});
router.get("/moneytransfers", function (req, res) {
  res.render("moneytransfers");
});
router.get("/listOfMovments", function (req, res) {
  res.render("listOfMovments");
});
router.get("/listOfLoans", function (req, res) {
  res.render("listOfLoans");
});
router.get("/chat", function (req, res) {
  res.render("chat");
});
//
router.post("/allClients", async (req, res) => {
  try {
    let allclients = await client.getAll();
    res.json(allclients);
  } catch (err) {
    console.log("error" + err);
  }
});
router.post("/getClientByID", (async  (req, res) =>  {
var client_id = req.body.ID;
let myclient = null;
try{
  [myclient]= await client.REQUEST({ID: client_id});
  if(myclient) {
    //console.log("getClientByID-client found: " + myclient);
    res.send(myclient);   }
 }catch (err) { console.log(`Failure ${err}`); }
}));

// loginשליפת נתונים שהזין המשתמש ב
router.post("/login", (async  (req, res) =>  {
  var data = req.body;
  var id_ = req.body.ID;
  let myclient = null;
  //console.log(JSON.stringify(req.body) + " id: " + id_); 
 try{
  [myclient]= await client.REQUEST({ID: id_});
 }catch (err) { console.log(`Failure ${err}`); }
  console.log(myclient);
  if(myclient) {
    console.log("client found: " + myclient);
    res.send("myclient");   
}
    else {console.log("client not found");
          //res.send("0");
          //check if manager
       let mymanager = null;
    try{
      [mymanager]= await manager.REQUEST({ID: id_});
     }catch (err) { console.log(`Failure ${err}`); }
      //console.log(mymanager);
      if(mymanager != null) {
        console.log("mymanager found: " + mymanager);
        res.send("mymanager");   
    }
        else {console.log("manager not found");
        res.send("0");} 
     }
  
}));

var urlencodedParser = bodyParser.urlencoded({ extended: false })
router.get('/api/user', urlencodedParser, function(req, res) 
{
    var userid_ = req.query.userid;
    var myclient = client.findByID(userid_);
  
    //var user=((jsonData.users).find(u=>u.username === username));
    //console.log(user)
    res.send(myclient)
});
// add new client
router.post('/newclient', async function (req, res) {
  var nw_client = req.body;
  //var numOfClinents = await client.find().count(); 
  if(nw_client)
  {
    try {
      const c = new client(nw_client);
      c.save();  
      // update levcoin value

      var numOfClinents = await client.find().count();
        //console.log("numOfClinents: " + numOfClinents);
        // update lev coin value
        let [dd] = await levcoin.REQUEST();
        let d = dd.dolar_value;
        let noac = dd.num_of_all_coins;
        //console.log("Number(noac) " + Number(noac) + typeof(noac))
        let allCoins = Number(noac) + Number(nw_client.numOfCoins);
        //console.log(" allCoins " + allCoins + typeof(allCoins))
        let dv = 1 - numOfClinents * 0.01;
        //console.log("dv: " + dv + " allcoins: " + allCoins);
        let lc = { dolar_value: dv, num_of_all_coins: allCoins };

        levcoin.deleteOne(
          { num_of_all_coins: noac, dolar_value: d },
          function (err) {
            if (err) console.log(err);
          }
        );
        //console.log("lev coin deleted");
        const l1 = new levcoin(lc);
        l1.save();
        //console.log("lev coin created");
  
    res.send("true");
    } catch (error) {
      console.log(error);
    }
   
    
  }
  else { res.send("false");}
});

//update client
router.post('/updateclient', function(req,res){
  console.log("updateclient")
var upclient = req.body; // update client
if(upclient)
{

  //find the old delete him and add the new
   
  client.deleteOne({ID: upclient.ID},function(err){
    if(err) console.log(err);                       
    });
    const c = new client(upclient);
    c.save();  
    //.log(" new clieb creted");
    res.send("true");
}
else {res.send("false");
console.log("upclient null")}
});
//delete client
router.get('/deleteclient', function(req,res){
  client.deleteOne({ID:req.body.ID},function(err){
    if(err) console.log(err); 
    else res.send("true");                      
    });
    
});

router.post('/dolartoshekel', async function(req,res){
  let numOfDolars = req.body.dolars;
     
    const browser = await puppeteer.launch( {headless: false});
    const page = await browser.newPage();
    await page.goto('https://www.hamara.co.il/');
 
    
    await page.type('#SelectCurrencyAmount', numOfDolars); //numOfDolars = 10 defult
    await page.click('input[id =calcsubmit]');
    
    await page.waitForSelector('.FinalAmountText')
    let element = await page.$('.FinalAmountText')
    let value = await page.evaluate(el => el.textContent, element)
   
    console.log(value);
    await browser.close();
    res.send(value);
    
    
})
module.exports = router;
