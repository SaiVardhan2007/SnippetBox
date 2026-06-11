const express = require('express');
const app = express();
const dotenv = require('dotenv').config();
const connectDB = require('./config/dbConnection');
const cors = require('cors');
const PORT = process.env.PORT || process.env.BACKEND_PORT || 4000;

const allowedOrigins = [
    process.env.FRONTEND_URL ? process.env.FRONTEND_URL.replace(/\/$/, '') : '',
    'http://localhost:5173'
];

const corsOptions = {
    origin: (origin, callback) => {
        if (!origin) return callback(null, true);
        const sanitizedOrigin = origin.replace(/\/$/, '');
        if (
            allowedOrigins.includes(sanitizedOrigin) || 
            sanitizedOrigin.endsWith('.vercel.app')
        ) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
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