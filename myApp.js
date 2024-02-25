require('dotenv').config();

const express = require('express');
const app = express();
const bodyParser = require('body-parser');

console.log("Hello");
const absolutePath = __dirname + '/views/index.html';
const publicPath = __dirname + '/public';
let jsonData = {"message": "Hello json"};


// middleware that will apply only on the /public route
app.use("/public", express.static(publicPath));

// middlewares that will apply on every request, 
// next insures that after it is read it's getting out to go for the next action/command
app.use(
    function(req, res, next) {
        console.log(req.method + " " + req.path + " - " + req.ip);
        next();
    }
);

// body parser is needed to see the content of a POST request,
// because the paylod of the request is in the body wich is encoded
/***** Encoded body ******/ 
// POST /path/subpath HTTP/1.0
// From: john@example.com
// User-Agent: someBrowser/1.0
// Content-Type: application/x-www-form-urlencoded
// Content-Length: 20

// name=John+Doe&age=25
/************************/ 
app.use(bodyParser.urlencoded({extended: false}));


// index route
app.get("/", (req, res) => {
    res.sendFile(absolutePath);
});

// json route
app.get("/json", (req, res) => {

    if (process.env.MESSAGE_STYLE === "uppercase") {
        jsonData.message = "HELLO JSON";
    } else {
        jsonData.message = "Hello json";
    }

    res.json(jsonData);
});

// now route
app.get('/now', function(req, res, next) {
    req.time = new Date().toString();  // Hypothetical synchronous operation
    next();
}, function(req, res) {
    res.send({time: req.time});
});

// echo route
// :word is a route parameter
/***** route structure *****/ 
// route_path: '/:word/echo'
// actual_request_URL: '/freecodecamp/echo'
// req.params: {word: 'freecodecamp'} 
/***************************/
app.get('/:word/echo', function(req, res, next) {
    word = req.params.word;
    next();
}, function(req, res) {
    res.send({echo: word});
});


// name route GET
/***** route structure *****/ 
// route_path: '/library'
// actual_request_URL: '/library?userId=546&bookId=6754'
// req.query: {userId: '546', bookId: '6754'}
/***************************/
app.route('/name')  
    .get((req, res, next) => {
        first = req.query.first;
        last = req.query.last;
        next();
    }, (req, res) => {
        res.send({ name: first + " " + last });
    })

// name route POST
/***** route structure *****/ 
// route: POST '/library'
// urlencoded_body: userId=546&bookId=6754
// req.body: {userId: '546', bookId: '6754'}
/***************************/
app.route('/name')  
    .post((req, res, next) => {
        first = req.body.first;
        last = req.body.last;
        next();
    }, (req, res) => {
        res.send({ name: first + " " + last });
    })




 module.exports = app;

