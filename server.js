const req = require("express");
const https = require("https");
const bodyparser = require("body-parser");
const { log } = require('console');
const otherfile = require("./data_processing");

const app = req();
app.use(bodyparser.urlencoded({extended:true}));

app.get("/",function(req,res){
  res.sendFile(__dirname+"/index.html");
});


app.post("/",function(req,res){
    let follow=req.body.followcount;
    let topic =  req.body.Topic;
    let  location = req.body.City;
    otherfile.nw(topic,follow,location);
    // res.send("Data received successfully!");
  })

// console.log(industry,topic,location);
  

app.listen(3000,function(){
    console.log("Server is running on 3000");
  })