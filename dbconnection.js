const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const Users= "";
// Connection URL
const url = 'mongodb://localhost:27017';
 
// Database Name
const dbName = 'myproject';
var dbconnection = function(){}

exports.dbconnection = dbconnection;

// Use connect method to connect to the server
dbconnection.createConnection = function(params,callback){
 
MongoClient.connect(url, function(err, client) {
  assert.equal(null, err);
  console.log("Connected successfully to server");
 
  const db = client.db(dbName);
 callback(null,db);
  //client.close();
})
}
