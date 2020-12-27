var session = require('cookie-session');
var express = require('express');
app = express();
app.set('trust proxy', 1);
app.use(session({
name: 'session',
keys: ['key1','key2']
}));

app.get('/visit', function(req,res) {
req.session.nvisit = (req.session.nvisit >= 0) ? req.session.nvisit += 1 : 1;
if (req.session.nvisit > 1) {
res.send('Welcome back! This is your ' + req.session.nvisit + ' visits');
} else {
res.send('Welcome!');
} 
});

app.get('/',function(req,res) {
if (!req.session.authenticated) {
res.redirect('/login');
}
res.status(200).end('Hello, ' + req.session.username +
'! This is a secret page!');
});

app.get('/login',function(req,res) {
res.sendFile(__dirname + '/public/login.html');
});
app.post('/login',function(req,res) {
for (var i=0; i<users.length; i++) {
if (users[i].name == req.body.name &&
users[i].password == req.body.password) {
req.session.authenticated = true;
req.session.username = users[i].name;
}
}
res.redirect('/');
});


app.listen(process.env.PORT || 8099);
