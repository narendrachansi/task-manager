class Task{
    constructor(db){
        this.db=db
    }
    addTask(description){
        this.db.dbConnect();
        this.db.connection.query("insert into tasks (description) values(?)",[description],function(error,results,fields){
            if(error) throw error
        });
        this.db.dbConnectionEnd();
    }
    getTasks(callback){
        this.db.dbConnect()
        this.db.connection.query("select * from tasks",(error,results,fields)=>{
            if(error) throw error
            callback(results)
        })
        this.db.dbConnectionEnd();
    }
    getTask(id,callback){
        this.db.dbConnect()
        this.db.connection.query("select * from tasks where id=?",[id],(error,results,fields)=>{
            if(error) throw error
            callback(results)
            this.db.dbConnectionEnd();
        })
    }
}
module.exports=Task;