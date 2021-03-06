const express=require('express');
const bcrypt=require('bcrypt');
const Database=require('../db/dbconnection');
const User=require('../models/user');
const multer=require('multer')
const auth=require('../middleware/auth')
const fs = require('fs');
const jimp=require('jimp')
const constant=require('../../constants/constant')
const Email=require('../emails/email')
// create express router to manage routers in separate pages
const router=new express.Router()

//add a new user
router.post('/users',async (req,res)=>{
    const db=new Database()
    const user=new User(db.connection)
    const name=req.body.name
    const email=req.body.email
    const password=req.body.password
    if(!name || !email || !password){
       return res.send('Data entry missing!')
    }
    try{
        db.dbConnect()
        await user.addUser(name,email,password,(id)=>{
            if(!id){
                return res.status(404).send('User not added!')
            }
            user.generateAuthToken(id,tokens=null,(token)=>{
                user.getUser(id,(data)=>{
                    data[0].token=token
                    data.toJSON=function(){
                        delete this[0].password
                        delete this[0].tokens
                        return this
                    }
                    const email=new Email()
                    const mailOptions = {
                        from: constant.username,
                        to: data[0].email,
                        subject: 'Accounted created',
                        text: 'New account created'
                    };
                     email.sendEmail(mailOptions,(outcome)=>{
                         console.log(outcome)
                     })                 
                    res.status(201).send(data)
                    db.dbConnectionEnd()
                })
            })
        });
    }catch(e){
        res.send(e);
        db.dbConnectionEnd()
    }
})

//login
router.post("/users/login",async (req,res)=>{
    const db=new Database()
    const user=new User(db.connection)
    const email=req.body.email
    const password=req.body.password
    if(!email || !password){
        return res.status(404).send('Login details missing')
    }
    try{
        db.dbConnect()
        await user.login(email,(data)=>{
            if(!data[0].password){
                db.dbConnectionEnd()
                return res.status(400).send('Invalid Username')
            }
            bcrypt.compare(password,data[0].password,(error,result)=>{
                if(!result){
                    db.dbConnectionEnd()
                    return res.status(400).send('Invalid password')
                }
                user.generateAuthToken(data[0].id,data[0].tokens,(token)=>{
                    user.getUser(data[0].id,(data)=>{
                        data[0].token=token
                        data.toJSON=function(){
                            delete this[0].password
                            delete this[0].tokens
                            return this
                        }
                        db.dbConnectionEnd()
                        res.status(200).send(data)
                    }) 
                })               
            })
        })
    }catch(e){
        res.status(500).send(e)
        db.dbConnectionEnd()
    }
})

// logout a single user token
router.post("/users/logout",auth,async (req,res)=>{
    try{
        const tokens=req.user[0].tokens
        const token=req.token
        const updatedTokens=tokens.filter(eachToken=>eachToken.token!==token)
        req.user[0].tokens=updatedTokens
        const db=new Database()
        const user=new User(db.connection) 
        db.dbConnect()
        await user.updateToken(updatedTokens,req.user[0].id)
        res.status(200).send()
        db.dbConnectionEnd()
    }catch(e){
        res.status(500).send(e)
        db.dbConnectionEnd()
    }
})

//logout all
router.post("/users/logoutall",auth,async (req,res)=>{
    try{
        const tokens=req.user[0].tokens
        const token=req.headers.authorization.replace('Bearer ','')
        req.user[0].tokens=[]
        const db=new Database()
        const user=new User(db.connection) 
        db.dbConnect()
        await user.updateToken(req.user[0].tokens,req.user[0].id)
        res.status(200).send()
        db.dbConnectionEnd()
    }catch(e){
        res.status(500).send(e)
        db.dbConnectionEnd()
    }
})

//get user profile after authentication
router.get("/users/me",auth,(req,res)=>{
    res.status(200).send(req.user)
    // try{
    //     const db=new Database()
    //     const user=new User(db)
    //     user.getUsers((data)=>{
    //         res.status(200).send(data);
    //     });
    // }catch(e){
    //     res.status(500).send()
    // }
})


//get a single user
// router.get("/users/:id",(req,res)=>{
//     const id=req.params.id
//     try{
//         const db=new Database()
//         const user=new User(db)
//         user.getUser(id,(data)=>{
//             if(data.length===0){
//                 return res.status(404).send()
//             }
//             res.status(200).send(data);
//         });
//     }catch(e){
//         res.status(500).send(e)
//     }
// })

//update profile
router.patch("/users/me",auth,async (req,res)=>{
    try{
        const id=req.user[0].id
        const fields=['name','email','password']
        if(req.body.password) {
            hashedPassword=await bcrypt.hash(req.body.password,8)
        }
        const updateData=[]
        let sql=''
        fields.map((field)=>{
            if(req.body[field]){
                sql += field+'=?,'
                if(field=='password'){
                    updateData.push(hashedPassword)
                }else{
                    updateData.push(req.body[field])
                }            
            }
        })
        const query=sql.replace(/,+$/, ''); 
        updateData.push(id)
        const db=new Database()
        const user=new User(db.connection)
        db.dbConnect()
        await user.updateUser(query,updateData,(numberOfaffectedRows)=>{
            if(numberOfaffectedRows==0) return res.status(404).send('Id not found!!!');
            res.status(200).send('User updated');
            db.dbConnectionEnd()
        })
    }catch(e){
        res.status(500).send(e)
        db.dbConnectionEnd()
    }
})

/*
//update a user
router.patch("/users/:id",auth,async (req,res)=>{
    const id=req.params.id
    const name=req.body.name
    const email=req.body.email
    const password=req.body.password
    if(!id || !name || !email || !password){
        return res.send('Missing data to update with');
    }
    try{
        const hashedPassword=await bcrypt.hash(password,8)
        const db=new Database()
        const user=new User(db)
        await user.updateUser(id,name,email,hashedPassword,(numberOfaffectedRows)=>{
            if(numberOfaffectedRows==0) return res.status(404).send('Id not found!!!');
            res.status(200).send('User updated');
        })
    }catch(e){
        res.status(500).send(e)
    }
})
*/
// delete profile
router.delete("/users/me",auth,async (req,res)=>{
    const id=req.user[0].id
    try{
        const db=new Database()
        const user=new User(db.connection)
        db.dbConnect()
        await user.deleteUser(id,(numberOfaffectedRows)=>{
            if(numberOfaffectedRows==0) return res.status(404).send('Id not found!!!');
            const email=new Email()
            const mailOptions = {
                from: constant.username,
                to: req.user[0].email,
                subject: 'Test account deleted',
                text: 'Test acccount deleted'
            };
            // email.sendEmail(mailOptions,(outcome)=>{
            //     console.log(outcome)
            // }) 
            res.status(200).send('User deleted');
            db.dbConnectionEnd() 
        })      
    }catch(e){
        res.status(500).send(e)
        db.dbConnectionEnd()
    }
})

//delete a user
// router.delete("/users/:id",async (req,res)=>{
//     const id=req.params.id
//     if(!id){
//         return res.status(404).send('Missing id to be deleted');
//     }
//     try{
//         const db=new Database()
//         const user=new User(db)
//         await user.deleteUser(id,(numberOfaffectedRows)=>{
//             if(numberOfaffectedRows==0) return res.status(404).send('Id not found!!!');
//             res.status(200).send('User deleted');
//         })       
//     }catch(e){
//         res.status(500).send(e)
//     }
// })


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      const path= 'avatars/'+req.user[0].id+'_'+req.user[0].name
      if (!fs.existsSync(path)){
        fs.mkdirSync(path);
      }
      cb(null, path)
    },
    filename: function (req, file, cb) {
        cb(null,'profile.jpg')
    },
    fileFilter(req,file,cb){
        if(!file.originalname.match(/\.(jpg|jpeg|gif|jiff)$/)){
            return cb(new Error('Please upload word documents'))
        }
        cb(undefined,true)
    }
  })

  const upload=multer({
    storage: storage,
    limits:{
        fileSize: 1000000
    },
    fileFilter(req,file,cb){
        if(!file.originalname.match(/\.(jpg|jpeg|gif|jiff)$/)){
            return cb(new Error('Please upload images'))
        }
        cb(undefined,true)
    }
})

// upload avatar for profile
//call back function will handle the unexpected error occured in middleware upload
router.post("/users/me/avatar",auth,upload.single('avatar'),(req,res)=>{
    const path= 'avatars/'+req.user[0].id+'_'+req.user[0].name+'/'+'profile.jpg'
    jimp.read(path, (err, lenna) => {
        if (err) throw err;
        lenna
          .resize(200,jimp.AUTO) // resize
          .quality(60) // set JPEG quality
          .greyscale() // set greyscale
          .write(path); // save
      });
    res.status(200).send()
},(error,req,res,next)=>{
    if(error) res.status(400).send({'error':error.message})
})

router.delete("/users/me/avatar",auth,(req,res)=>{
    const path= 'avatars/'+req.user[0].id+'_'+req.user[0].name+'/profile.jpg'
      if (fs.existsSync(path)){
        fs.unlinkSync(path)
      }
      res.status(200).send('Profile image deleted')
})


module.exports=router