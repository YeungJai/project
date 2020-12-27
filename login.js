const express = require('express');
const session = require('cookie-session');
const assert = require('assert');
const bodyParser = require('body-parser');
const app = express();
const MongoClient = require('mongodb').MongoClient;
const mongourl = 'mongodb+srv://yeung:yeung@cluster0.s6s8q.mongodb.net/test?retryWrites=true&w=majority';
const dbName = 'test';
const formidable = require('express-formidable');
const ObjectID = require('mongodb').ObjectID;
const fs = require('fs');


app.set('view engine','ejs');

const SECRETKEY = 'I want to pass COMPS381F';

const users = new Array(
	{name: 'developer', password: 'developer'},
	{name: 'guest', password: 'guest'}
);

app.set('view engine','ejs');

app.use(session({
  name: 'loginSession',
  keys: [SECRETKEY]
}));

const findDocument = (db, criteria, callback) => {
    let cursor = db.collection('groupproject').find(criteria);
    console.log(`findDocument: ${JSON.stringify(criteria)}`);
    cursor.toArray((err,docs) => {
        assert.equal(err,null);
        console.log(`findDocument: ${docs.length}`);
        callback(docs);
    });
}
const handle_Find = (res, criteria) => {
    const client = new MongoClient(mongourl);
    client.connect((err) => {
        assert.equal(null, err);
        console.log("Connected successfully to server");
        const db = client.db(dbName);

        findDocument(db, criteria, (docs) => {  
            client.close();
            console.log("Closed DB connection");
            res.status(200).render('list',{nGroupproject: docs.length, groupproject: docs});
            
        });
    });
}
const handle_Details = (res, criteria) => {
    const client = new MongoClient(mongourl);
    client.connect((err) => {
        assert.equal(null, err);
        console.log("Connected successfully to server");
        const db = client.db(dbName);

        /* use Document ID for query */
        let DOCID = {};
        DOCID['_id'] = ObjectID(criteria._id)
        findDocument(db, DOCID, (docs) => {  // docs contain 1 document (hopefully)
            client.close();
            console.log("Closed DB connection");
            res.status(200).render('details', {groupproject: docs[0]});
            
        });
    });
}
const handle_Create = (req,res, criteria) => {
const client = new MongoClient(mongourl);
    client.connect((err) => {
	assert.equal(null, err);
        console.log("Connected successfully to server");
        const db = client.db(dbName);
let newDoc ={};

 if (req.files.filetoupload && req.files.filetoupload.size > 0) {
fs.readFile(req.files.filetoupload.path, (err,data) => {
		assert.equal(err,null);
                    newDoc['photo'] = new Buffer.from(data).toString('base64');
db.collection('groupproject').insertOne({
            
            restaurant_id: req.fields.restaurant_id,
        name: req.fields.name,
borough: req.fields.borough,
photo: req.files.newDoc['photo'] = new Buffer.from(data).toString('base64'),
photomimetype: req.fields.photomimetype,
cuisine: req.fields.cuisine,
address: {
street: req.fields.street,
building: req.fields.building,
zipcode: req.fields.zipcode,
coord: {
lon: req.fields.lon,
lat: req.fields.lat
}},
grades: {
user: req.fields.user,
score: req.fields.score
},
owner: req.fields.owner}
,(err,results) => {
                        assert.equal(err,null);
                        client.close()
                        res.status(200).render('new',{messagee: `Create success`});
                    })
})
}
});
}

// support parsing of application/json type post data
app.use(formidable());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req,res) => {
	if (!req.session.authenticated) {   
		res.redirect('/login');
	} else {
		res.redirect('/find');
	}
});

app.get('/login', (req,res) => {
	res.status(200).render('login',{});
});

app.post('/login', (req,res) => {
	users.forEach((user) => {
		if (user.name == req.body.name ) {
			// correct user name + password
			// store the following name/value pairs in cookie session
			req.session.authenticated = true;        // 'authenticated': true
			req.session.username = req.body.name;	 // 'username': req.body.name		
		}
	});
	res.redirect('/');
});
app.get('/find', (req,res) => {
    handle_Find(res, req.query.docs);
})
app.get('/logout', (req,res) => {
	req.session = null;   // clear cookie-session
	res.redirect('/');
});

app.listen(process.env.PORT || 8099);
