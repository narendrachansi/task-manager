const request=require('supertest')
const app=require('../src/app')
const {userOne,taskOne,setupDatabase}=require('../tests/fixtures/db')

beforeEach(setupDatabase)

test("should add a new task for authorized user",async ()=>{
   await request(app)
    .post('/tasks')
    .set('Authorization',`Bearer ${userOne.tokens[0].token}`)
    .send({
        description:'Updated'
    })
    .expect(201)
})

test("shouldn't add a new task for unauthorized user",async ()=>{
    await request(app)
     .post('/tasks')
     .send({
         description:'Updated'
     })
     .expect(401)
 })

 test("should fetch tasks of authorized user",async ()=>{
    const response=await request(app)
     .get('/tasks')
     .set('Authorization',`Bearer ${userOne.tokens[0].token}`)
     .send()
     .expect(200)
     expect(response.body[0].id).not.toBeNull()

 })

 test("shouldn't fetch tasks of unauthorized user",async ()=>{
    const response=await request(app)
     .get('/tasks')
     .send()
     .expect(401)
 })

 test("should delete task of authorized user", async ()=>{
    await request(app)
    .delete('/tasks/'+taskOne.id)
    .set('Authorization',`Bearer ${userOne.tokens[0].token}`)
    .expect(200)
 })

 test("shouldn't delete task of unauthorized user", async ()=>{
   await request(app)
   .delete('/tasks/'+taskOne.id)
   .expect(401)
})