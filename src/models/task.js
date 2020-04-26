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

    updateTask(id,description,completed,callback){
        this.db.dbConnect();
        this.db.connection.query("UPDATE tasks set description=? , completed=? WHERE id=?",[description,completed,id], function (error, results, fields) {
            if(error) throw error
            callback(results.affectedRows);
        });
        this.db.dbConnectionEnd();
    }

    deleteTask(id,callback){
        this.db.dbConnect();
        this.db.connection.query("DELETE FROM tasks WHERE id=?",[id], function (error, results, fields) {
            if(error) throw error
            callback(results.affectedRows);
        });
        this.db.dbConnectionEnd();
    }
}
module.exports=Task;