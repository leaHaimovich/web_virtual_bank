
var express = require("express");
var router = express.Router();
router.use(express.json());
//chat 
var io = require('socket.io-client');
const socket = io.connect("http://localhost:4001");
//var  Chat = require( "../Chat");
var currentMessage = null;
var messageList = [];
 
  router.post('/joinChat', async function(req,res){
    let room = req.body.room;
    socket.emit("join_room", room);
res.send(true);
  });
 router.post('/sendMessage',async (req,res) => {
    let username = req.body.username;
    let room = req.body.room;
    currentMessage = req.body.currentMessage;
    
    //let socket = req.body.socket;
   // let currentMessage = req.body.currentMessage;
   // let messageList = req.body.messageList;
    if (currentMessage !== null) {
      //console.log("hi im sening message")
      const messageData = {
        room: room,
        author: username,
        message: currentMessage,
        time:
          new Date(Date.now()).getHours() +
          ":" +
          new Date(Date.now()).getMinutes(),
      };
     
      console.log("im about to send to server")
      socket.emit("send_message", messageData);
     
      messageList = messageList + messageData;//((list) => [...list, messageData]);
      //socket.on("receive_message",messageData)
      socket.on("receive_message",(data)=>{
        console.log("im in receive message,")
        messageList = messageList + data;
        console.log("im in receive message, messageList: " +JSON.stringify(messageList) + " type " + typeof(messageList) )
      })
      currentMessage=null;
    }
    //let s = {messageList: messageList}
    console.log("its all went well, sending messageList: " + JSON.stringify(messageList) )//typeof (messageList))
    res.send(messageList)
  });

  /*useEffect(() => {
    socket.on("receive_message", (data) => {
      messageList= messageList +data;
    });
  }, [socket]);*/

  router.post('/getmessageList',function(req,res){
    res.send(messageList);
  });
  module.exports = router;