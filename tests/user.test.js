const request=require('supertest')
const app=require('../src/app')
const User=require('../src/models/user')
const Email=require('../src/emails/email')
jest.mock('../src/emails/email', () => require('./__mocks__/email'))
const {userOne,setupDatabase}=require('../tests/fixtures/db')

/**** 
 * runs before each test
 * delete all users and add one test user
 */
beforeEach(setupDatabase)

test('Should signup a new user', async ()=>{
    const response=await request(app).post("/users").send({
        "name":"test",
        "email":"test@yahoo.com",
        "password":"test"
    }).expect(201)
    //Assert database was changed correclty
    expect(response.body.id).not.toBeNull()
    
    //Assertion to test user name
    expect(response.body[0].name).toMatch('test')

    //Assertion to test object
    // expect(response.body[0]).toMatchObject({
    //     user:{
    //         name:'test',
    //         email:"test@yahoo.com"
    //     }
    // })

})

test('Should login existing user',async ()=>{
    await request(app).post("/users/login").send({
        email:userOne.email,
        password:userOne.password
    }).expect(200)
})

test('should not login non existing user', async ()=>{
    await request(app).post('/users/login').send({
        email:userOne.email,
        password:'wrongpassword'
    }).expect(400)
})

test('should get the profile info',async ()=>{
    await request(app)
    .get('/users/me')
    .set('Authorization',`Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200)
})

test('shouldnot get the profile info for unauthenticated user',async ()=>{
    await request(app)
    .get('/users/me')
    .send()
    .expect(401)
})


test('should update the profile info', async ()=>{
    await request(app)
    .patch('/users/me')
    .set('Authorization',`Bearer ${userOne.tokens[0].token}`)
    .send({
        name:'updated'
    })
    .expect(200)
})

test("shouldn't update the profile info", async ()=>{
    await request(app)
    .patch('/users/me')
    .send({
        name:'updated'
    })
    .expect(401)
})

test("should delete profile if authenticated", async ()=>{
    const response=await request(app)
    .delete('/users/me')
    .set('Authorization',`Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200)
    expect(response.text).toMatch('User deleted')
})

test("shouldn't delete profile if not authenticated", async ()=>{
    await request(app)
    .delete('/users/me')
    .send()
    .expect(401)
})