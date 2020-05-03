const jwt=require('jsonwebtoken')
const bcrypt=require('bcrypt');
class User{
    constructor(connection){
        this.connection=connection
    }
    async addUser(name,email,password,callback){
        const hashedPassword= await bcrypt.hash(password,8)
        this.connection.query("insert into users(name,email,password) values(?,?,?)",[name,email,hashedPassword], function (error, results, fields) {
            if(error) throw error
            callback(results.insertId)
        });
    }
    login(email,callback){
        this.connection.query("select * from users where email=?",[email],function(error,results,fields){
            if(error) throw error
            if(results.length!==0){
                callback(results)
            }else{
                callback('')
            }            
        })
    }
    unserializeTokens(tokens){
        if(tokens){
            return JSON.parse(tokens)
        }else{
            return []
        }       
    }
    async generateAuthToken(id,tokenList,callback){
        const tokens=this.unserializeTokens(tokenList)
        const token= await jwt.sign({'id':id.toString()},'VSC!')
        tokens.push({token})
        this.connection.query("UPDATE users set tokens=? WHERE id=?",[JSON.stringify(tokens),id], function (error, results, fields) {
            if(error) throw error
            callback(token);
        });     
    }
    updateToken(tokens,id){
        if(tokens.length===0)
            this.updateTokens=''
        else
            this.updateTokens=JSON.stringify(tokens)
        this.connection.query("UPDATE users set tokens=? WHERE id=?",[this.updateTokens,id], function (error, results, fields) {
            if(error) throw error
        });     
    }
    getUsers(callback){
        this.connection.query("select * from users", function (error, results, fields) {
            if(error) throw error
            callback(results);
        });
    }
    getUser(id,callback){
        this.connection.query("select * from users where id=?",[id], function (error, results, fields) {
            if(error) throw error
            callback(results);
        });
    }

    updateUser(sql,updateData,callback){
        this.connection.query("UPDATE users set "+sql+" WHERE id=?",updateData, function (error, results, fields) {
            if(error) throw error
            callback(results.affectedRows);
        });
    }
    
    deleteUser(id,callback){
        this.connection.query("DELETE FROM users WHERE id=?",[id], function (error, results, fields) {
            if(error) throw error
            callback(results.affectedRows);
        });
    }
    deleteAllUser(){
        this.connection.query("DELETE FROM users", function (error, results, fields) {
            if(error) throw error
        });
    }
}

module.exports=User;

