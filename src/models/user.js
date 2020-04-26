class User{
    constructor(db){
        this.db=db
    }
    addUser(name,email,password){
        this.db.dbConnect();
        this.db.connection.query("insert into users(name,email,password) values(?,?,?)",[name,email,password], function (error, results, fields) {
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

