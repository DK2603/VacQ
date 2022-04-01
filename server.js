const express = require('express');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');


//Load env vars
dotenv.config({path:'./config/config.env'});

//Connect to database
connectDB();

//Route files
const hospitals =require('./routes/hospitals');
const auth = require('./routes/auth');
const appointments =require('./routes/appointments');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const xss=require('xss-clean');
const rateLimit=require('express-rate-limit');
const hpp=require('hpp');
const cors=require('cors');

const app=express();



//cookie parser
app.use(cookieParser());

//Body parser
app.use(express.json());


// Sanitize dara
app.use(mongoSanitize());

//Set security header 
app.use(helmet());

//Prevent XSS create
app.use(xss());

//Rate Limiting
const limiter= rateLimit({
    windowsMS:10*60*1000, //10 mins
    max: 1
});
app.use(limiter);

//Prevent http param polutions
app.use(hpp());


// Enable CORS
app.use(cors());


//Mount routers
app.use('/api/v1/hospitals', hospitals);
app.use('/api/v1/auth',auth);
app.use('/api/v1/appointments', appointments);
const PORT=process.env.PORT || 5000;
const server =app.listen(PORT,console.log('Server running in', process.env.NODE_ENV,'mode on port', PORT));


//Handle unhandled promise rejections
process.on('unhandledRejection',(err,promise)=>{
    console.log(`Error: ${err.message}`);
    //close server & exit process
    server.close(()=>process.exit(1));
});