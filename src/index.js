const express=require('express');
const app=express()
const port=process.env.PORT || 3000
const Database=require('./db/dbconnection');
const User=require('./models/user');
const Task=require('./models/task');

app.use(express.json());

//add a new user
app.post('/users',async (req,res)=>{
    const db=new Database()
    const user=new User(db)
    try{
        await user.addUser(req.body.name,req.body.email,req.body.password);
        res.status(201).send(req.body);
    }catch(e){
        res.send(e);
    }
})

//get all users using call function
app.get("/users",(req,res)=>{
    try{
        const db=new Database()
        const user=new User(db)
        user.getUsers((data)=>{
            res.status(200).send(data);
        });
    }catch(e){
        res.status(500).send()
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

//update a user
app.patch("/users/:id",async (req,res)=>{
    const id=req.params.id
    const name=req.body.name
    const email=req.body.email
    const password=req.body.password
    if(!id || !name || !email || !password){
        return res.send('Missing data to update with');
    }
    try{
        const db=new Database()
        const user=new User(db)
        await user.updateUser(id,name,email,password,(numberOfaffectedRows)=>{
            if(numberOfaffectedRows==0) return res.status(404).send('Id not found!!!');
            res.status(200).send('User updated');
        })
    }catch(e){
        res.status(500).send(e)
    }
})

//delete a user
app.delete("/users/:id",async (req,res)=>{
    const id=req.params.id
    if(!id){
        return res.send('Missing id to be deleted');
    }
    try{
        const db=new Database()
        const user=new User(db)
        await user.deleteUser(id,(numberOfaffectedRows)=>{
            if(numberOfaffectedRows==0) return res.status(404).send('Id not found!!!');
            res.status(200).send('User deleted');
        })       
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

//update a task
app.patch("/tasks/:id",async (req,res)=>{
    const id=req.params.id
    const description=req.body.description
    const completed=req.body.completed
    if(!id || !description || !completed){
        return res.send('Missing data to update with');
    }
    try{
        const db=new Database()
        const task=new Task(db)
        await task.updateTask(id,description,completed,(numberOfaffectedRows)=>{
            if(numberOfaffectedRows==0) return res.status(404).send('Id not found!!!');
            res.status(200).send('Task updated');
        })
    }catch(e){
        res.status(500).send(e)
    }
})

//delete a task
app.delete("/tasks/:id",async (req,res)=>{
    const id=req.params.id
    if(!id){
        return res.send('Missing data to update with');
    }
    try{
        const db=new Database()
        const task=new Task(db)
        await task.deleteTask(id,(numberOfaffectedRows)=>{
            if(numberOfaffectedRows==0) return res.status(404).send('Id not found!!!');
            res.status(200).send('Task deleted');
        })
    }catch(e){
        res.status(500).send(e)
    }
})

app.listen(port,()=>{
    console.log('Server started at port '+ port);
});


