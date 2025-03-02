const express = require("express");
const userRoutes = require('./routes/userRoute.js');
const cors = require('cors');


const app = express();
app.use(express.json());
app.use(cors());


app.use('/users',userRoutes);
app.get("/", (req, res ) => {
    res.json({message : "Welcome to the Express server"})
})

module.exports = app;