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
}

module.exports=User;

