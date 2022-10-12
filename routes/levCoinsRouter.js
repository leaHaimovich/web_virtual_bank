var express = require("express");
var router = express.Router();

const debug = require("debug")("mongo:test");
const prompt = require("../prompt");
const timeout = require("../timeout");

//const client = require('../models')("Client");
const levcoin = require('../models')("LevCoin");
//const client = require('../models/client');
//var bodyParser = require('body-parser');
//const app = express();
//router.use(express.json());

router.post('/geLevCoin', async function(req,res){
    let [mylevcoin] = await levcoin.REQUEST();
    console.log("mylevcoin "+mylevcoin)
    res.send(mylevcoin);
});


module.exports = router;