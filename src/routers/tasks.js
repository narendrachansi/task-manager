const express=require('express');
const router=new express.Router()
const Database= require('../db/dbconnection');
const Task= require('../models/task');

//add new task
router.post("/tasks",(req,res)=>{
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
router.get("/tasks",(req,res)=>{
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
router.get("/tasks/:id",(req,res)=>{
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
router.patch("/tasks/:id",async (req,res)=>{
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
router.delete("/tasks/:id",async (req,res)=>{
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

module.exports=router