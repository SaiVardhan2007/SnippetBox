const express = require('express');
const app = express();
const dotenv = require('dotenv').config();
const connectDB = require('./config/dbConnection');
const cors = require('cors');
const PORT = process.env.PORT || process.env.BACKEND_PORT || 4000;

const corsOptions = {
    origin: process.env.NODE_ENV === 'production'
        ? process.env.FRONTEND_URL
        : 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions))
app.use(express.json());
connectDB();
app.get('/', (req,res)=>{
    res.json({"message": "server is running"})
})
app.use("/api/snippets", require("./routes/snippetRoutes"))
app.use("/api/categories", require("./routes/categoryRoutes"))
app.use("/api/users", require("./routes/userRoutes"))
app.use(require("./middleware/error_Handler"))
app.listen(PORT, ()=>{
    console.log("server is running on PORT: " + PORT)
})