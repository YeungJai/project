'use strict'
const express = require('express');
const app = express();
const { MongoClient } = require('mongodb')
const ObjectID = require('mongodb').ObjectID;
const assert = require('assert');
const fs = require('fs');
const formidable = require('express-formidable');
const bodyParser = require('body-parser');
const mongourl = 'mongodb+srv://yeung:yeung@cluster0.s6s8q.mongodb.net/test?retryWrites=true&w=majority';
const dbName = 'test';
const session = require('cookie-session');

//app.use(formidable());
app.set('view engine', 'ejs');
const SECRETKEY = 'I want to pass COMPS381F';
const users = new Array(
	{name: 'demo', password: 'demo'},
	{name: 'student', password: 'student'}
);

app.use(session({
  name: 'loginSession',
  keys: [SECRETKEY]
}));
const findDocument = (db, criteria, callback) => {
    let cursor = db.collection('restaurant').find(criteria);
    console.log(`findDocument: ${JSON.stringify(criteria)}`);
    cursor.toArray((err,docs) => {
        assert.equal(err,null);
        console.log(`findDocument: ${docs.length}`);
        callback(docs);
    });
}

app.get('/api/restaurant/cuisine/:cuisine',(req,res) => {
    if (req.params.cuisine) {
        let criteria = {};
     criteria['cuisine'] = req.params.cuisine;
        const client = new MongoClient(mongourl);
        client.connect((err) => {
            assert.equal(null, err);
            console.log("Connected successfully to server");
            const db = client.db(dbName);

            findDocument(db, criteria, (docs) => {
                client.close();
                console.log("Closed DB connection");
                res.status(200).json(docs);
            });
        });
    } else {
        res.status(500).json({"error": "missing restaurant_id"});
    }
})
app.get('/api/restaurant/borough/:borough',(req,res) => {
    if (req.params.borough) {
        let criteria = {};
     criteria['borough'] = req.params.borough;
        const client = new MongoClient(mongourl);
        client.connect((err) => {
            assert.equal(null, err);
            console.log("Connected successfully to server");
            const db = client.db(dbName);

            findDocument(db, criteria, (docs) => {
                client.close();
                console.log("Closed DB connection");
                res.status(200).json(docs);
            });
        });
    } else {
        res.status(500).json({"error": "missing restaurant_id"});
    }
})

app.get('/api/restaurant/name/:name',(req,res) => {
    if (req.params.name) {
        let criteria = {};
     criteria['name'] = req.params.name;
        const client = new MongoClient(mongourl);
        client.connect((err) => {
            assert.equal(null, err);
            console.log("Connected successfully to server");
            const db = client.db(dbName);

            findDocument(db, criteria, (docs) => {
                client.close();
                console.log("Closed DB connection");
                res.status(200).json(docs);
            });
        });
    } else {
        res.status(500).json({"error": "missing restaurant_id"});
    }
})
const handle_Find = (res, criteria) => {
    const client = new MongoClient(mongourl);
    client.connect((err) => {
        assert.equal(null, err);
        console.log("Connected successfully to server");
        const db = client.db(dbName);

        findDocument(db, criteria, (docs) => {  
            client.close();
            console.log("Closed DB connection");
            res.status(200).render('list',{nRestaurant: docs.length, restaurant: docs});
            
        });
    });
}

const handle_Create = (req,res, criteria) => {
const client = new MongoClient(mongourl);
    client.connect((err) => {
	assert.equal(null, err);
        console.log("Connected successfully to server");
        const db = client.db(dbName);
let newDoc ={}
/*let newDoc = {
            restaurant_id: req.fields.restaurant_id;,
        name: req.fields.name;,
borough: req.fields.borough;,
photomimetype: req.fields.photomimetype;,
cuisine: req.fields.cuisine;,
address: {
street: req.fields.street;,
building: req.fields.building;,
zipcode: req.fields.zipcode;,
coord: {
lon: req.fields.lon;,
lat: req.fields.lat;
}},
user: req.fields.user;,
score: req.fields.score;,
owner: req.fields.owner;
};*/
 if (req.files.filetoupload && req.files.filetoupload.size > 0) {
fs.readFile(req.files.filetoupload.path, (err,data) => {
		assert.equal(err,null);
                    newDoc['photo'] = new Buffer.from(data).toString('base64');
db.collection('restaurant').insertOne({
            restaurant_id: req.fields.restaurant_id,
        name: req.fields.name,
borough: req.fields.borough,
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
,newDoc,(err,results) => {
                        assert.equal(err,null);
                        client.close()
                        res.status(200).render('new',{messagee: `Create success`});
                    })
})
}



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
            res.status(200).render('details', {restaurant: docs[0]});
            
        });
    });
}

const handle_Edit = (res, criteria) => {
    const client = new MongoClient(mongourl);
    client.connect((err) => {
        assert.equal(null, err);
        console.log("Connected successfully to server");
        const db = client.db(dbName);

        /* use Document ID for query */
        let DOCID = {};
        DOCID['_id'] = ObjectID(criteria._id)
        let cursor = db.collection('restaurant').find(DOCID);
        cursor.toArray((err,docs) => {
            client.close();
            assert.equal(err,null);
            res.status(200).render('edit',{restaurant: docs[0]});
            
        });
    });
}



const updateDocument = (criteria, updateDoc, callback) => {
    const client = new MongoClient(mongourl);
    client.connect((err) => {
        assert.equal(null, err);
        console.log("Connected successfully to server");
        const db = client.db(dbName);

         db.collection('restaurant').updateOne(criteria,
            {
                $set : updateDoc
            },
            (err, results) => {
                client.close();
                assert.equal(err, null);
                callback(results);
            }
        );
    });
}



    

const handle_Update = (req, res, criteria) => {
    // Q2
    // const form = new formidable.IncomingForm(); 
    //form.parse(req, (err, fields, files) => {
        var DOCID = {};
        DOCID['_id'] = ObjectID(req.fields._id);
        var updateDoc = {};
        updateDoc['restaurant_id'] = req.fields.restaurant_id;
        updateDoc['name'] = req.fields.name;
updateDoc['borough'] = req.fields.borough;
updateDoc['cuisine'] = req.fields.cuisine;
updateDoc['street'] = req.fields.street;
updateDoc['building'] = req.fields.building;
updateDoc['zipcode'] = req.fields.zipcode;
updateDoc['lon'] = req.fields.lon;
updateDoc['lat'] = req.fields.lat;
updateDoc['owner'] = req.fields.owner;
        if (req.files.filetoupload.size > 0) {
            fs.readFile(req.files.filetoupload.path, (err,data) => {
                assert.equal(err,null);
                updateDoc['photo'] = new Buffer.from(data).toString('base64');
                updateDocument(DOCID, updateDoc, (results) => {
                    res.status(200).render('info', {message: `Updated ${results.result.nModified} document(s)`})
                    /*
                    res.writeHead(200, {"content-type":"text/html"});
                    res.write(`<html><body><p>Updated ${results.result.nModified} document(s)<p><br>`);
                    res.end('<a href="/">back</a></body></html>');
                    */
                });
            });
        } else {
            updateDocument(DOCID, updateDoc, (results) => {
                res.status(200).render('info', {message: `Updated ${results.result.nModified} document(s)`})
                /*
                res.writeHead(200, {"content-type":"text/html"});
                res.write(`<html><body><p>Updated ${results.result.nModified} document(s)<p><br>`);
                res.end('<a href="/">back</a></body></html>');
                */
            });
        }
    //})
    // end of Q2
}
app.get("/leaflet", (req,res) => {
	res.render("leaflet.ejs", {
		lat:req.query.lat,
		lon:req.query.lon,
		zoom:req.query.zoom ? req.query.zoom : 15
	});
	res.end();
});
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
app.get('/logout', (req,res) => {
	req.session = null;   // clear cookie-session
	res.redirect('/');
});

app.get('/create', (req,res) => {
    res.render("create.ejs", {
		
	});
	res.end();
})
app.post('/create',formidable(), (req,res) => {
    handle_Create(req, res, req.query);
})


app.get('/find', (req,res) => {
    handle_Find(res, req.query.docs);
})

app.get('/details', (req,res) => {
    handle_Details(res, req.query);
})

app.get('/edit', (req,res) => {
    handle_Edit(res, req.query);
})

app.post('/update',formidable(), (req,res) => {
    handle_Update(req, res, req.query);
})

app.get('/*', (req,res) => {
    //res.status(404).send(`${req.path} - Unknown request!`);
    res.status(404).render('info', {message: `${req.path} - Unknown request!` });
})

app.listen(app.listen(process.env.PORT || 8099));
