const request=require('supertest')
const app=require('../../src/app')
const Database=require('../../src/db/dbconnection')
const jwt=require('jsonwebtoken')
const User=require('../../src/models/user')
const Task=require('../../src/models/task')
const userOne={
    name:"superman",
    email:"superman@gmail.com",
    password:"superman!@",
}

const taskOne={
    description:'test task'
}

const setupDatabase= async (done)=>{
    const db=new Database()
    const user=new User(db.connection)
    const task= new Task(db.connection)
    db.dbConnect()
    await user.deleteAllUser()
    await user.addUser(userOne.name,userOne.email,userOne.password,(id)=>{
        userOne.id=id
        userOne.tokens=[{token:jwt.sign({'id':id.toString()},'VSC!')}]
        user.updateToken(userOne.tokens,id)
        task.deleteAllTasks()
        task.addTask(userOne.id,taskOne.description,(lastinsertid)=>{
            taskOne.id=lastinsertid
            taskOne.owner=userOne.id
            db.dbConnectionEnd()
            done()
        })
    })

}

module.exports={
    userOne,
    taskOne,
    setupDatabase
}