require("dotenv").config();
const express = require("express");
const cors = require('cors')

const passport = require("passport");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const authRoutes = require("./routes/authRoutes");
const notesRoutes = require('./routes/notesRoutes');
const errorHandler = require('./middlewares/errorHandler')
const connectDB = require("./config/db");
const aiRoutes=require("./routes/aiRoutes")

const app = express();

app.use(cors({
    origin: ["http://localhost:3000", "http://localhost:3300"],
    methods:['GET','POST' ,'PUT', 'PATCH', 'DELETE'],
    credentials: true
}));

//Connection
connectDB()
require("./config/passport");

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(session({ secret: "secret", resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());


// Routes
app.use("/auth", authRoutes);
app.use("/api", notesRoutes);
app.use("/api",aiRoutes)


app.use(errorHandler)



  


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));