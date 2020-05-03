const express=require('express');
const router=new express.Router()
const Database= require('../db/dbconnection');
const Task= require('../models/task');
const auth=require('../middleware/auth')
//add new task
router.post("/tasks",auth,async (req,res)=>{
    const owner=req.user[0].id
    if(!req.body.description){
        res.status(505).send('Post data missing!');
    }else{
        const db=new Database()
        const task=new Task(db.connection)
        try{
            db.dbConnect()
            await task.addTask(owner,req.body.description,(lastinsertid)=>{
                task.getTask(lastinsertid,owner,(data)=>{
                    res.status(201).send(data);
                    db.dbConnectionEnd()
                })
            })           
        }catch(e){
            res.status(505).send('Error: '+e);
        }
    } 
})

//fetch all tasks of logged on user
router.get("/tasks",auth,(req,res)=>{
    let completed, limit, skip, sortBy
    if(req.query.completed)
    {
        if(req.query.completed==='true')  completed=1
        else if(req.query.completed=='false') completed=0
    } 
    if(req.query.limit) limit=parseInt(req.query.limit)
    if(req.query.skip) skip=parseInt(req.query.skip)
    if(req.query.sortBy){
        sortBy=req.query.sortBy
        sortBy=sortBy.split('_')
    } 
   
    try{
        const db=new Database()
        const task=new Task(db.connection)
        db.dbConnect()
        task.getTasks(req.user[0].id,completed,limit,skip,sortBy,(data)=>{
            res.status(200).send(data)
            db.dbConnectionEnd()
        })
    }catch(e){
        res.status(505).send(e)
    }
})

//fetch a particular task of a logged on user
router.get("/tasks/:id",auth,(req,res)=>{
    const id=req.params.id
    const owner=req.user[0].id
    try{
        const db=new Database()
        const task=new Task(db.connection)
        db.dbConnect()
        task.getTask(id,owner,(data)=>{
            if(data.length===0){
                return res.status(404).send('Task not found')
            }
            res.status(200).send(data)
            db.dbConnectionEnd()
        })
    }catch(e){
        res.status(505).send()
    }
    
})

//update a task of logged on user
router.patch("/tasks/:id",auth,async (req,res)=>{
    const fields=['descrition','completed']
    const id=req.params.id
    const owner=req.user[0].id
    let sql=''
    const updateData=[]
    fields.map(field=>{
        if(req.body[field]){
            sql += field+'=?,'
            updateData.push(req.body[field])
        }
    })
    if(!id || updateData.length===0){
        return res.send('Missing data to update with');
    }
    const query=sql.replace(/,+$/, '');
    updateData.push(id)
    updateData.push(owner)
    try{
        const db=new Database()
        const task=new Task(db.connection)
        db.dbConnect()
        await task.updateTask(query,updateData,(numberOfaffectedRows)=>{
            if(numberOfaffectedRows==0) return res.status(404).send('Id not found!!!');
            task.getTask(id,owner,(data)=>{
                if(data.length===0){
                    return res.status(404).send('Task not found')
                }
                res.status(200).send(data)
                db.dbConnectionEnd()
            })
        })
    }catch(e){
        res.status(500).send(e)
    }
})

//delete a task
router.delete("/tasks/:id",auth,async (req,res)=>{
    const id=req.params.id
    const owner=req.user[0].id
    if(!id){
        return res.send('Missing data to update with');
    }
    try{
        const db=new Database()
        const task=new Task(db.connection)
        db.dbConnect()
        await task.deleteTask(id,owner,(numberOfaffectedRows)=>{
            if(numberOfaffectedRows==0) return res.status(404).send('Id not found!!!');
            res.status(200).send('Task deleted');
            db.dbConnectionEnd()
        })
    }catch(e){
        res.status(500).send(e)
    }
})

module.exports=router