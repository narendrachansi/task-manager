const jwt=require('jsonwebtoken')
class User{
    constructor(db){
        this.db=db
    }
    addUser(name,email,password,callback){
        this.db.dbConnect();
        this.db.connection.query("insert into users(name,email,password) values(?,?,?)",[name,email,password], function (error, results, fields) {
            if(error) throw error
            callback(results.insertId)
        });
    }
    login(email,callback){
        this.db.dbConnect()
        this.db.connection.query("select id,password,tokens from users where email=?",[email],function(error,results,fields){
            if(error) throw error
            if(results.length!==0){
                callback(results[0].id.toString(),results[0].password,results[0].tokens)
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
    async generateAuthToken(id,email,password,tokenList,callback){
        const tokens=this.unserializeTokens(tokenList)
        const token= await jwt.sign({'id':id.toString()},'VSC!')
        tokens.push({token})
        this.db.connection.query("UPDATE users set tokens=? WHERE id=?",[JSON.stringify(tokens),id], function (error, results, fields) {
            if(error) throw error
            callback({user:{id,email,password,tokens},token});
        });     
        this.db.dbConnectionEnd();
    }
    updateToken(tokens,id){
        if(tokens.length===0)
            this.updateTokens=''
        else
            this.updateTokens=JSON.stringify(tokens)
        this.db.dbConnect()
        this.db.connection.query("UPDATE users set tokens=? WHERE id=?",[this.updateTokens,id], function (error, results, fields) {
            if(error) throw error
        });     
        this.db.dbConnectionEnd();
    }
    getUsers(callback){
        this.db.dbConnect();
        this.db.connection.query("select * from users", function (error, results, fields) {
            if(error) throw error
            callback(results);
        });
        this.db.dbConnectionEnd();
    }
    getUser(id,callback){
        this.db.dbConnect();
        this.db.connection.query("select * from users where id=?",[id], function (error, results, fields) {
            if(error) throw error
            callback(results);
        });
        this.db.dbConnectionEnd();
    }

    updateUser(id,name,email,password,callback){
        this.db.dbConnect();
        this.db.connection.query("UPDATE users set name=? , email=?, password=? WHERE id=?",[name,email,password,id], function (error, results, fields) {
            if(error) throw error
            callback(results.affectedRows);
        });
        this.db.dbConnectionEnd();
    }
    
    deleteUser(id,callback){
        this.db.dbConnect();
        this.db.connection.query("DELETE FROM users WHERE id=?",[id], function (error, results, fields) {
            if(error) throw error
            callback(results.affectedRows);
        });
        this.db.dbConnectionEnd();
    }
}

module.exports=User;

