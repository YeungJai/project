const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const http = require('http');
const url = require('url');
 
const mongourl = 'mongodb+srv://yeung:as137911@cluster0.s6s8q.mongodb.net/test?retryWrites=true&w=majority';
const dbName = 'test';
const client = new MongoClient(mongourl);
 
const DOC = [
    {
  "restaurant_id": "0002",
  "name": "best",
  "borough": "Bronx",
  "cuisine": "Bakery",
  "photo":"test.png",
  "photomimetype": "png",
  "address": {
    "street": "yuenlong",
    "building": "1009",
    "zipcode": "000000",
    "coord": {      
        "lon": "-73.856066",
        "lat": "40.848447"
      }
    
  },
  "grades": 
    {
      "user": "dema",
      "score": "2"
      }
,
"owner": "demo"
},
    	{
  "restaurant_id": "0003",
  "name": "test",
  "borough": "Bronx",
  "cuisine": "Bakery",
  "photo":"test2.png",
  "photomimetype": "png",
  "address": {
    "street": "Morris Park Ave",
    "building": "1010",
    "zipcode": "000000",
    "coord": 
      {
        "lon": "-73.856055",
        "lat": "40.848480"
      }
    
  ,
  "grades":  
    {
      "user": "demoo",
      "score": "5"
      },

"owner": "demo"
}
}
];

const insertDocument = (db, doc, callback) => {
    db.collection('groupproject').
    insertMany(doc, (err, results) => {
        assert.equal(err,null);
        console.log(`Inserted document(s): ${results.insertedCount}`);
        callback();
    });
}

client.connect((err) => {
    assert.equal(null, err);
    console.log("Connected successfully to server");
    const db = client.db(dbName);
    insertDocument(db, DOC, () => {
        client.close();
        console.log("Closed DB connection");
    })
});
