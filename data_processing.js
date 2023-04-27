// Load the MySQL module
const mysql = require('mysql');
// Load the data from processed_data.json
const fs = require('fs');
const data = JSON.parse(fs.readFileSync('dataCollectionOutput.json'));
const req = require("express");
const https = require("https");
const bodyparser = require("body-parser");
const { log } = require('console');

const app = req();
app.use(bodyparser.urlencoded({extended:true}));

// // // const { industry, topic, location } = require('./server.js');cc
// console.log(industry);


// Create a connection to the MySQL database

function nw(first,third,second){
  const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '007@dev00',
    database: 'iis'
  });
  
  
  
  // Connect to the database
  connection.connect(function(err) {
    if (err) throw err;
    console.log('Connected to the MySQL database!');
  });
  
  // Define the industry, topic, and location of interest
  
  // Define the number of top influencers to return
  const n = 2;
  // console.log(first,third,second);
  
  // Filter the influencers based on industry, topic, and location
  const filteredInfluencers = data.influencers.filter(influencer => {
    return influencer.topics[1]===first&&influencer.followerCount>third &&influencer.location === second;
  });
  console.log(filteredInfluencers);
  // Calculate the maximum number of followers among the filtered influencers
  const maxFollowers = Math.max(...filteredInfluencers.map(influencer => influencer.followerCount));
  
  // Calculate the score for each filtered influencer and store it in a new property called "score"
  filteredInfluencers.forEach(influencer => {
    influencer.score = (influencer.followerCount * influencer.engagementRate * influencer.topics.length) / maxFollowers;
  });
  
  // Sort the filtered influencers by score in descending order
  filteredInfluencers.sort((a, b) => b.score - a.score);
  
  // Return the top n influencers
  const topInfluencers = filteredInfluencers.slice(0, n);
  
  // Insert the top influencers into the "influencers" table, ignoring duplicates
  topInfluencers.forEach(influencer => {
    const sql = `INSERT IGNORE INTO selected_influencer (name, follower_count, engagement_rate, score, location, email) VALUES (?, ?, ?, ?, ?, ?)`;
    const values = [influencer.name, influencer.followerCount, influencer.engagementRate, influencer.score, influencer.location, influencer.email];
    connection.query(sql, values, function(err, result) {
      if (err) throw err;
      if (result.affectedRows > 0) {
        console.log('Influencer inserted:', influencer.name);
      } else {
        console.log('Duplicate influencer skipped:', influencer.name);
      }
    });
  });
  
  // Disconnect from the database
  connection.end(function(err) {
    if (err) throw err;
    console.log('Disconnected from the MySQL database!');
  });
}
module.exports ={
  nw,
}


