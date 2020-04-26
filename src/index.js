const express=require('express');
const app=express()
const port=process.env.PORT || 3000
const Database=require('./db/dbconnection');
const User=require('./models/user');
const Task=require('./models/task');

app.use(express.json());

//add a new user
app.post('/users',(req,res)=>{
    try{
        const db=new Database()
        const user=new User(db)
        user.addUser(req.body.name,req.body.email,req.body.password);
        res.status(201).send(req.body);
    }catch(e){
        res.send(e);
    }
})

//get all users
app.get("/users",(req,res)=>{
    try{
        const db=new Database()
        const user=new User(db)
        user.getUsers((data)=>{
            res.status(200).send(data);
        });
    }catch(e){
        res.state(500).send()
    }
})

//get a single user
app.get("/users/:id",(req,res)=>{
    const id=req.params.id
    try{
        const db=new Database()
        const user=new User(db)
        user.getUser(id,(data)=>{
            if(data.length===0){
                return res.status(404).send()
            }
            res.status(200).send(data);
        });
    }catch(e){
        res.status(500).send(e)
    }
})

//add new task
app.post("/tasks",(req,res)=>{
    if(!req.body.description){
        res.send('Post data missing!');
    }else{
        try{
            const db=new Database()
            const task=new Task(db)
            task.addTask(req.body.description);
            res.status(201).send(req.body);
        }catch(e){
            res.send('Error: '+e);
        }

    } 
})

//fetch all tasks
app.get("/tasks",(req,res)=>{
    try{
        const db=new Database()
        const task=new Task(db)
        task.getTasks((data)=>{
            if(data.length===0){
                return res.status(404).send()
            }
            res.status(200).send(data)
        })
    }catch(e){
        res.status(505).send(e)
    }
})

//fetch a particular task
app.get("/tasks/:id",(req,res)=>{
    const id=req.params.id
    try{
        const db=new Database()
        const task=new Task(db)
        task.getTask(id,(data)=>{
            if(data.length===0){
                return res.status(404).send('Task not found')
            }
            res.status(200).send(data)
        })
    }catch(e){
        console.log(e);
        res.status(505).send()
    }
    
})

app.listen(port,()=>{
    console.log('Server started at port '+ port);
});


