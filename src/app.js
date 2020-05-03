const express=require('express');
const app=express()
const port=process.env.PORT
// below is return if environment variables for port in not set for dev
//const port=process.env.PORT || 3000
const Database=require('./db/dbconnection');
const User=require('./models/user');
const Task=require('./models/task');
const userRouter=require('./routers/users');
const taskRouter=require('./routers/tasks');

//request ====== Middleware ========= route
//Middleware is executed before routing. next() will ensure route occurs
//Middleware to show Maintenance page
// app.use((req,res,next)=>{
//     console.log(req.method+' '+req.url);
//     res.status(503).send('Under Maintenance!!')
// })

// it will make sure data returned is json format.
app.use(express.json());
app.use(userRouter);
app.use(taskRouter);

module.exports=app




