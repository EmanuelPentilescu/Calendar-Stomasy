const express = require("express");
const mysql = require("mysql");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const app = express();
const router = require('./routes/admin');


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
const path = require('path');
__dirname = path.resolve();
app.use(express.static((path.join(__dirname, 'public'))));

// ------ DATA BASE CONNECTION ---------//
const connection = require('./util/database');
connection.connect(error => {
    if (error) 
        console.log(error);
     else 
        console.log("Successfully connected to the database");
    
});
// -------------------------------------//


app.use(router);


app.listen(3000, () => {
    console.log("Calendar app listening on port 3000");
});
