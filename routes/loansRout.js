var express = require("express");
var router = express.Router();
const debug = require("debug")("mongo:test");
const prompt = require("../prompt");
const timeout = require("../timeout");
//const client = require('../models/client');
//const loan = require('../models/loan');
const loan = require("../models")("Loan");
const client = require("../models")("Client");
var bodyParser = require("body-parser");
const { json } = require("express");
router.use(express.json());

router.post("/allLoans", async (req, res) => {
  try {
    let allloans = await loan.getAll();
    res.json(allloans);
  } catch (err) {
    console.log("error" + err);
  }
});

// add new loan
router.post("/newloan", async (req, res) => {
  var nw_loan = req.body;
  var c = null;
  if (nw_loan) {
    let new_loan = {
      lender_ID: nw_loan.lender_ID,
      borrower_ID: nw_loan.borrower_ID,
      numOfCoins: nw_loan.numOfCoins,
      date_of_loan: nw_loan.date_of_loan,
    };
    console.log("loan in not null " + JSON.stringify(new_loan));
    let lender = null;
    let borrower = null;
    try {
      [lender] = await client.REQUEST({ ID: nw_loan.lender_ID });
      [borrower] = await client.REQUEST({ ID: nw_loan.borrower_ID });
    } catch (err) {
      console.log(`Failure ${err}`);
    }
    //.log("lender " + lender + " borrower"+borrower );
    if (lender && borrower) {
      let lender_numofcoins = Number(lender.numOfCoins);
      let borrower_numofcoins = Number(borrower.numOfCoins);
      let a = lender_numofcoins * 0.5;
      let b = borrower_numofcoins * 0.6;
      if (Number(nw_loan.numOfCoins) < a && Number(nw_loan.numOfCoins) < b) {
        console.log(
          "hi new_loan:" +
            JSON.stringify(new_loan) +
            "  nw_loan " +
            JSON.stringify(nw_loan)
        );
        c = await new loan(new_loan);
        c.save();
        let coins = lender_numofcoins - Number(nw_loan.numOfCoins);

        // update client nom of coins
        //lender.numOfCoins = lender.numOfCoins - nw_loan.numOfCoins;
        client.deleteOne({ ID: lender.ID }, function (err) {
          if (err) console.log(err);
        });
        let uplender = {
          first_name: lender.first_name,
          last_name: lender.last_name,
          numOfCoins: coins,
          date_of_birth: lender.date_of_birth,
          ID: lender.ID,
          password: lender.password,
          phone_number: lender.phone_number,
        };

        const c1 = new client(uplender);
        c1.save();
        //update borrow
        client.deleteOne({ ID: borrower.ID }, function (err) {
          if (err) console.log(err);
        });
        var borrowCoins = borrower_numofcoins + Number(nw_loan.numOfCoins);
        console.log(
          " borrower.numOfCoins " +
            borrower_numofcoins +
            "nw_loan.numOfCoins" +
            borrowCoins
        );
        let upborrow = {
          first_name: borrower.first_name,
          last_name: borrower.last_name,
          numOfCoins: borrowCoins,
          date_of_birth: borrower.date_of_birth,
          ID: borrower.ID,
          password: borrower.password,
          phone_number: borrower.phone_number,
        };

        const upb = new client(upborrow);
        upb.save();
        res.send("true");
      } else {
        res.send("false");
      }
    } else {
      console.log("lender not found");
      res.send("false");
    }
  } else {
    console.log("not saved");
    res.send("false");
  }
});

module.exports = router;
