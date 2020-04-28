const jwt=require('jsonwebtoken')
const User=require('../models/user')
const Database=require('../db/dbconnection')
const auth =async (req,res,next) =>{
    const token=req.headers.authorization.replace('Bearer ','')
    const decodedId=await jwt.verify(token,'VSC!')
    const db=new Database()
    const user=new User(db)
    try{
        await user.getUser(decodedId.id,(data)=>{
            const tokens=data[0].tokens
            const allTokens=user.unserializeTokens(tokens)
            if(allTokens.find(eachtoken=>eachtoken.token===token)){
                data[0].tokens=allTokens
                req.user=data
                next()
            }else{
                res.status(404).send('Error: Please Authenticate')
            }        
        })
    }catch(e){
        res.status(404).send('Error: Please Authenticate')
    }   
}

module.exports=auth