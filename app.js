var express = require('express')
var app = express();
var bodyParser = require('body-parser');
var dbconnection = require('./dbconnection').dbconnection;
var abc = require('./dbconnection');
var gConnection;
var generator = require('node-uuid-generator')
//let bodyParser = require('body-parser');
app.use(bodyParser.raw({ limit: '50mb' }));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

app.post('/save_user', (req, res) => {

    var response;
    var content = req.body;
    content._id = generator.generate();
    if (content === "") {
        response = {
            "status": false,
            "error": {
                "message": "Invalid data.",
            },
            "data": {}
        };
    } else {
        try {
            gConnection.collection("Users").insert(content, function (err, result) {
                if (err)
                    throw err;
                else {
                    response = {
                        "status": true,
                        "error": {},
                        "data": {
                            "message": "User added successfully.",
                            "user": result.ops[0]
                        }
                    }
                }
                res.setHeader('Content-Type', 'application/json');
                res.setHeader('Access-Control-Allow-Origin', '*');
                res.send(response);
            });


        } catch (ex) {
            console.log('exception')
            console.log(ex)
            response = {
                "status": false,
                "error": {
                    "message": "Failed to add User.",
                },
                "data": {}
            };
            res.setHeader('Content-Type', 'application/json');
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.send(response);
        }
    }

});
app.post('/login', (req, res) => {
    var response;
    var content = req.body;
    if (content.email === "" || content.password === "") {
        response = {
            "status": false,
            "error": {
                "message": "Invalid data.",
            },
            "data": {}
        };
    } else {
        try {
            var query = { "email": content.email, "password": content.password };
            gConnection.collection("Users").find(query).toArray(function (err, result) {
                if (err) throw err;
                else {
                    if (result && result.length > 0) {
                        response = {
                            "status": true,
                            "error": {},
                            "data": {
                                "message": "User login successfully.",
                                "user": result[0]
                            }
                        }
                    }
                    else {
                        response = {
                            "status": false,
                            "error": {
                                "message": "Invalid credentials",
                            },
                            "data": {}
                        }
                    }

                    res.setHeader('Content-Type', 'application/json');
                    res.setHeader('Access-Control-Allow-Origin', '*');
                    res.send(response);

                }

            });
        } catch (ex) {
            console.log('exception')
            console.log(ex)
            response = {
                "status": false,
                "error": {
                    "message": "Failed to login User.",
                },
                "data": {}
            };
            res.send(response);
        }
    }
});

app.listen(3000, function (dbObj) {
    console.log('server is up..................');
    dbconnection.createConnection('', function (err, connection) {
        if (err) {
            console.log('Error in database connection ................' + err);
        }
        else {
            console.log('Database connected successfully................');
            gConnection = connection;
        }
    })
});
