const express = require('express');
const app = express();
const dotenv = require('dotenv').config();
const connectDB = require('./config/dbConnection');
app.use(express.json());
const PORT = process.env.BACKEND_PORT || 4000;

connectDB();
app.get('/', (req,res)=>{
    res.json({"message": "server is running"})
})

app.use("/api/contacts", require("./routes/contactRoutes"))
app.use("/api/users", require("./routes/userRoutes"))
app.use(require("./middleware/error_Handler"))
app.listen(PORT, ()=>{
    console.log("server is running on PORT: " + PORT)
})