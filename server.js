require("dotenv").config();
const express = require('express');
const mysqlModule = require('mysql2');
//Because of the password update to using the Sha-2 or whatever ecryption. 
//mysql2 is a fork that got started to solve that issue, while retaining the updated, more secure password.

const app = express();
const PORT_NUMBER = parseInt(process.env.PORT) || 5000;

//Set up the middleware
app.use(express.json());
//app.use(express.urlencoded({ extended: false })); //If I want to do url encoded things

//Create the database connection
//Use environment variables for password stuff
const db = mysqlModule.createConnection({
    host: 'localhost',
    user: 'root',
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
});

//Connect to the wallerpianos database
db.connect((err) => {
    if(err){
        console.log("Can't connect to the DB --------------");
        throw err;
    }
    console.log("mySql Connected!");
});

module.exports = db;
//I think this exports the db var so that I can use it in other pages, like index.html or another js file or something.

app.listen(PORT_NUMBER, () =>{
    console.log(`Server started on port ${PORT_NUMBER}`);
})

//Remove a Client row in the database
app.delete('/client/removeClient/:clientId', (req, res) => {
    let sql = `DELETE FROM client WHERE idclient = ${req.params.clientId}`;
    
    db.query(sql, req.body, (err, results, fields) => {
        if (err){
            throw err;
        }
        res.json(results);
    });

})

//.get()  http://localhost:3000/authenticatedRedirect

//.get()  /google/authenticate/begin   To start the whole Auth process
/*
    Should return an Authorize URL as a code 302.
    I need a "state" variable to store with the User, so that we know who came back from the redirect.
*/

//Create a new Client row in the database
app.post('/client/newClient', (req, res) => {
    let keys = Object.keys(req.body);

    //console.log(keys);
    //console.log(keys.length);

    if(keys.length > 0){
        for(let i = 1; i<keys.length; i++){
            if(req.body[keys[i]]===""){
                req.body[keys[i]] = null;
            }else if(req.body[keys[i]] && isNullWord(req.body[keys[i]])){
                req.body[keys[i]] = null;
            }
        }
        req.body["idclient"] = null;//We want the database to generate it's own unique code for the new client
        
        //console.log(req.body);
        let sql = `INSERT INTO client SET ?`;
        
        db.query(sql, req.body, (err, results, fields) => {
            if(err){
                throw err;
            }
            res.json(results);
        });
    }else{
        res.status(500).end("At least one field must contain data.");
        /* res.writeHead(500, "At least one field must contain data");
        res.end(); */
    }

});

//Update an existing Client row in the database
app.put('/client/updateClient/:clientId', (req, res) => {
    let keys = Object.keys(req.body);

    //Sets all the "empty" values, and any "null" strings to be the actual value of null
    for(let i = 0; i<keys.length; i++){
        if(req.body[keys[i]]===""){
            req.body[keys[i]] = null;
        }else if(req.body[keys[i]] && isNullWord(req.body[keys[i]])){
            req.body[keys[i]] = null;
        }
    }

    let sql = `UPDATE client SET ? WHERE idclient = ${req.params.clientId}`;
    
    db.query(sql, req.body, (err, results, fields) => {
        if (err){
            throw err;
        }
        res.json(results);
    });
   
});

app.get('/client/:clientId', (req, res) => {
    //console.log(`Params ${req.params.clientId}`);
    let sql = `SELECT * FROM client where idclient = ${req.params.clientId};`;
    
    db.query(sql, (err, results, fields) => {
        if(err) {
            throw err;
        }
        res.json(results);
    });
});

//Pulls the address for a single client for use in a map service like Google Maps.
app.get(`/client/address/:clientId`, (req, res) => {
    let sql = `SELECT address1, city, state, zip FROM client WHERE idclient = ${req.params.clientId}`;

    db.query(sql, (err, results, fields) => {
        if (err) {
            throw err;
        }
        res.json(results);
    })
});

//Pull a list of clients with only limited info
//Should allow for slightly faster load time, and the rest of the data is unnecessary anyway
app.get('/clientAbbList', (req, res) =>{
    let sql = 'SELECT idclient, firstName, lastName, city FROM client order by lastName;';
    db.query(sql, (err, results, fields) => {
        if(err) {
            throw err;
        }
        res.json(results);
    })
});

//Pulls the last 5 clients and orders them chronologically
app.get('/recentClients', (req, res) => {
    //fix the sql so that it pulls the clients and orders by recent date
    let sql = 'SELECT * FROM client;';
    db.query(sql, (err, results, fields) => {
        if(err) {
            throw err;
        }
        res.json(results);
    })
});


function isNullWord(word){
    let value = word.toString();
    if(value.replace(" ", "").toUpperCase() === "NULL" || value.length === 0){
        return true;
    }
    return false;
}