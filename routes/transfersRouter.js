var express = require("express");
var router = express.Router();
const debug = require("debug")("mongo:test");
const prompt = require("../prompt");
const timeout = require("../timeout");
const loan = require("../models")("Loan");
const client = require("../models")("Client");
const transfers = require("../models")("Transfers");
var bodyParser = require("body-parser");
const { json } = require("express");
//const Block = require('../block')
router.use(express.json());
//import {Block} from '../block';

router.post('/alltransfers', async (req, res)=>{
     try {
        let alltransfers = await transfers.getAll() 
      // let alltransfers = await transfers.REQUEST({to_ID: to_id}) +  await transfers.REQUEST({from_ID: to_id}) ;
       //console.log(typeof(alltransfers));
      res.json(alltransfers)
      
   } catch (err) { console.log("error" + err) }
   });

   router.post('/allmovements', async (req, res)=>{
  
    let to_id = req.body.to_ID;
    //let borrower_id = req.body.borrower_ID;
    //console.log(" im in allLoans " + lender_id);
     try {
       let alltransfers = await transfers.getAll() //+  await transfers.REQUEST({from_ID: to_id}) ;
       //console.log(typeof(alltransfers) +"  " +alltransfers);
       //console.log(alltransfers.sort({date_of_transfers:1}));
       let allloans = await loan.getAll() //+  await loan.REQUEST({borrower_ID: to_id}) ;
       //.log(typeof(allloans));
     let movment = allloans + alltransfers;
     //console.log(movment)
      res.json(allloans)
      
   } catch (err) { console.log("error" + err) }
   });

// add new transfers
router.post("/newtransfers", async (req, res) => {
  var nw_transfers = req.body;
  var t = null;
  if (nw_transfers) {
    console.log("hi1")
    console.log("nw_transfers: " + JSON.stringify(nw_transfers));
    let new_transfers = {
      from_ID: nw_transfers.from_ID,
      to_ID: nw_transfers.to_ID,
      numOfCoins: nw_transfers.numOfCoins,
      date_of_transfers: nw_transfers.date_of_transfers,
    };
    console.log("transfers in not null " + JSON.stringify(new_transfers));
    let from = null;
    let to = null;
    try {
      [from] = await client.REQUEST({ ID: new_transfers.from_ID });
      [to] = await client.REQUEST({ ID: new_transfers.to_ID });
      console.log("from: " + from + " to: " + to);
    } catch (err) {
      console.log(`Failure ${err}`);
    }

    if (from && to) {
      if (from.numOfCoins - new_transfers.numOfCoins < 0)
        {    console.log("fail")
            res.send("transfers not appruval");}
        else{
            
         t = await new transfers(new_transfers);
         t.save();

         // update client nom of coins 
         let a =  Number(from.numOfCoins) 
        let coins  = a - Number(new_transfers.numOfCoins);
        client.deleteOne({ID: from.ID},function(err){
            if(err) console.log(err);                       
            });
            let upfrom={first_name: from.first_name,
              last_name:from.last_name,
              numOfCoins: coins,
              date_of_birth: from.date_of_birth,
              ID : from.ID,
              password :from.password,
              phone_number :from.phone_number };      
            const c1 = await new client(upfrom);
            c1.save();  

            //update to
          client.deleteOne({ID: to.ID},function(err){
            if(err) console.log(err);                       
            });
            let b = Number(to.numOfCoins) ;
          var toCoins = b + Number(new_transfers.numOfCoins) ;
          let upto={first_name: to.first_name,
            last_name:to.last_name,
            numOfCoins: toCoins,
            date_of_birth: to.date_of_birth,
            ID : to.ID,
            password :to.password,
            phone_number :to.phone_number };

            const upb = await new client(upto);
            upb.save();
         console.log("transfers succed!")
         res.send("transfers succed!")
        }
    }
  }
});


module.exports = router;