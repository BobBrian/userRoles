const express = require("express");
const cors = require("cors");
const pool = require("./db"); // Needs to be used in the Routes
const bcrypt = require("bcrypt");
const {check , validationResult} = require ("express-validator")
const jwt = require('jsonwebtoken') // used to generate JWT
//const jwtAuth = require("./checkAuth")
const app = express();


//middleware
app.use(cors())
app.use(express.json());

app.post("/data/register",async (req,res)=>{

    try {
        
        // Make Sure the req bodies are the same wherever you are
        const {user, email , password } = req.body;
        // user is substituting for name.
        const users = await pool.query("INSERT INTO datausers (name, email, password) VALUES ($1, $2, $3) RETURNING *", [user, email, password ]);
        console.log(user, email, password)
        res.json(users.rows[0]);
        
    } catch (err) {
        console.error(err.message)
    }
})

app.listen(5000, () =>{

    console.log("server is up and listening to port 5000");
});