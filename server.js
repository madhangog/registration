var express = require('express');
var morgan = require('morgan');
var path = require('path');
var Pool = require('pg').Pool;
var crypto = require('crypto');
var bodyParser = require('body-parser');
var session = require('express-session');


var config = {
  user : 'maddy',
  database: 'app',
  host: 'localhost',
  port: '5432',
  password: 'mambarai'
};

var app = express();
app.use(morgan('combined'));
app.use(bodyParser.json());
app.use(session({
    secret: 'someRandomSecretValue',
    cookie: { maxAge: 1000 * 60 * 60 * 24 * 30}
}));

var pool = new Pool(config);


app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'index.html'));
});

function hash(input,salt){
  //create a hash
  var hashed = crypto.pbkdf2Sync(input, salt, 10000, 512, 'sha512');
  return["pbkdf2","10000",salt,hashed.toString('hex')].join('$');
}

app.get('/hash/:input',function(req,res){
  var hashedstring = hash(req.params.input,'this-is-some-random=string');
  res.send(hashedstring);
})
  
app.post('/create-user', function (req, res) {
   // username, password
   // {"username": "tanmai", "password": "password"}
   // JSON
   var username = req.body.username;
   var names = req.body.names;
   var department = req.body.department;
   var year = req.body.year;
   var email = req.body.email;
   var mobile = req.body.mobile;
   var password = req.body.password;
   var intrested = req.body.intrested;
   var salt = crypto.randomBytes(128).toString('hex');
   var dbString = hash(password, salt);
   pool.query('INSERT INTO "user" (username,name,department,year,email,mobile,password,intrested) VALUES ($1, $2,$3,$4,$5,$6,$7,$8)', [username,names,department,year,email,mobile,dbString,intrested], function (err, result) {
      if (err) {
          res.status(500).send(err.toString());
      } else {
          res.send('User successfully created: ' + username);
      }
   });
});

app.post('/login', function (req, res) {
   var username = req.body.username;
   var password = req.body.password;
   if(username==="admin"){
    pool.query('SELECT * FROM "admin" WHERE username = $1', [username], function (err, result) {
      if (err) {
          res.status(500).send(err.toString());
      } else {
          if (result.rows.length === 0) {
              res.status(403).send('username/password is invalid');
          } else {
              // Match the password
              var dbString = result.rows[0].password;
              ; // Creating a hash based on the password submitted and the original salt
              if (password === dbString) {
                
                // Set the session
                req.session.auth = {userId: result.rows[0].id};
                // set cookie with a session id
                // internally, on the server side, it maps the session id to an object
                // { auth: {userId }}
                
                res.send('credentials correct!');

                
              } else {
                res.status(403).send('username/password is invalid');
              }
          }
      }
   });

   }
   else{
   pool.query('SELECT * FROM "user" WHERE username = $1', [username], function (err, result) {
      if (err) {
          res.status(500).send(err.toString());
      } else {
          if (result.rows.length === 0) {
              res.status(403).send('username/password is invalid');
          } else {
              // Match the password
              var dbString = result.rows[0].password;
              var salt = dbString.split('$')[2];
              var hashedPassword = hash(password, salt); // Creating a hash based on the password submitted and the original salt
              if (hashedPassword === dbString) {
                
                // Set the session
                req.session.auth = {userId: result.rows[0].id};
                // set cookie with a session id
                // internally, on the server side, it maps the session id to an object
                // { auth: {userId }}
                res.send('credentials correct!');

                
              } else {
                res.status(403).send('username/password is invalid');
              }
          }
      }
   });
 }
});

/*app.get('/check-login', function (req, res) {

   if (req.session && req.session.auth && req.session.auth.userId) {
       // Load the user object
       pool.query('SELECT * FROM "user" WHERE id = $1', [req.session.auth.userId], function (err, result) {
           if (err) {
              res.status(500).send(err.toString());
           } else {

            res.send(result.rows[0].username);    
           }
       });
   } else {
       res.status(400).send('You are not logged in');
   }
});*/

app.get('/logout', function (req, res) {
   /*if (req.session && req.session.auth && req.session.auth.userId) {
       // Load the user object
       pool.query('SELECT * FROM "user" WHERE id = $1', [req.session.auth.userId], function (err, result) {
           if (err) {
              res.status(500).send(err.toString());
           } else {
             var username = result.rows[0].username;
            pool.query('UPDATE "login" SET outtime=now() WHERE username = $1',[username],function (err, result) {
                if (err) {
                  res.status(500).send(err.toString());
              } else {
                  res.send('time inserted for ' + username);
                 }
             });

            //res.send(result.rows[0].username);    
           }
       });
   } else {
       res.status(400).send('You are not logged in');
   }

  */
   delete req.session.auth;
   res.send('<html><body>Logged out!<br/><br/><a href="/">Back to home</a></body></html>');
});



app.get('/register.html', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'register.html'));
});

app.get('/ui/style.css', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'style.css'));
});


/*app.post('/admin', function (req, res) {
   var username = req.body.username;
   var password = req.body.password;
   pool.query('SELECT * FROM "admin" WHERE username = $1', [username], function (err, result) {
      if (err) {
          res.status(500).send(err.toString());
      } else {
          if (result.rows.length === 0) {
              res.status(403).send('username/password is invalid');
          } else {
              // Match the password
              var dbString = result.rows[0].password;
              ; // Creating a hash based on the password submitted and the original salt
              if (password === dbString) {
                
                // Set the session
                req.session.auth = {userId: result.rows[0].id};
                // set cookie with a session id
                // internally, on the server side, it maps the session id to an object
                // { auth: {userId }}
                
                res.send('credentials correct!');

                
              } else {
                res.status(403).send('username/password is invalid');
              }
          }
      }
   });

});*/
app.get('/admin', function (req, res) {
pool.query('select username,name,department,year,email,mobile,intrested from "user"', function (err, result) {
  if (err) {
    res.status(500).send(err.toString());
    } else {
           // res.sendFile(path.join(__dirname, 'ui', 'admin.html'));
            //var row = result.rows;
            //res.send(row);
            res.send(result.rows);
           }
       });
});


app.get('/ui/register.css', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'register.css'));
});

app.get('/user', function (req, res) {
  
  res.sendFile(path.join(__dirname, 'ui', 'user.html'));
});


app.get('/ui/main.js', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'main.js'));
});

app.get('/ui/madi.png', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'madi.png'));
});


var port = 8080; // Use 8080 for local development because you might already have apache running on 80
app.listen(8080, function () {
  console.log(`IMAD course app listening on port ${port}!`);
});
