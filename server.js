const mysql = require("mysql")
const req = require("express");
const https = require("https");
const bodyparser = require("body-parser");
const { log } = require('console');
const otherfile = require("./data_processing");
const path = require('path');

const app = req();
app.use(bodyparser.urlencoded({extended:true}));
app.use(req.static(path.join(__dirname, './public')));

app.get("/",function(req,res){  
  res.sendFile(__dirname+"/IIS.html");
});


app.post("/",function(req,res){
    let follow=req.body.followcount;
    let topic =  req.body.Topic;
    let  location = req.body.City;
    otherfile.nw(topic,follow,location);
    res.redirect("/graph");
    // res.send("Data received successfully!");
  })

// console.log(industry,topic,location);

// Get selected influencers as an array
app.get("/influencers",function(req,res){
  const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '007@dev00',
    database: 'iis'
  });

  connection.connect(function(err) {
    if (err) throw err;
    console.log('Connected to the MySQL database!');

    const sql = `SELECT * FROM selected_influencer`;
    connection.query(sql, function(err, result) {
      if (err) throw err;
      console.log(result);
      res.json(result);
    });
  });
});
app.get("/graph", function(req, res) {
  
  res.sendFile(__dirname + "/graph.html");
//   const connection = mysql.createConnection({
//     host: 'localhost',
//     user: 'root',
//     password: '007@dev00',
//     database: 'iis'
//   });

//   connection.connect(function(err) {
//     if (err) throw err;
//     console.log('Connected to the MySQL database!');

//     const sql = `delete FROM selected_influencer`;
//     connection.query(sql, function(err, result) {
//       if (err) throw err;
//       // console.log(result);
//       // res.json(result);
//     });
// });
});


app.listen(3000,function(){
    console.log("Server is running on 3000");
  })