class Task{
    constructor(connection){
        this.connection=connection
    }
    addTask(owner,description,callback){
        this.connection.query("insert into tasks (owner,description) values(?,?)",[owner,description],function(error,results,fields){
            if(error) throw error
            callback(results.insertId)
        });
    }
    getTasks(id,completed,limit,skip,sortBy,callback){
        this.sql='owner=?'
        this.values=[id]
        if(completed){
            this.sql += ' and completed=?'
            this.values.push(completed)
        }
        if(sortBy){
            this.sql += ' ORDER BY'
            if(sortBy[0]) this.sql += ' '+sortBy[0]
            if(sortBy[1]) this.sql += ' '+sortBy[1]
        }
        if(limit){
            this.sql += ' limit ?'
            this.values.push(limit)
            if(skip){
                this.sql += ' OFFSET ?'
                this.values.push(skip)
            }
        }

        const test=this.connection.query("select * from tasks where "+this.sql,this.values,(error,results,fields)=>{
            if(error) throw error
            callback(results)
        })
    }
    getTask(id,owner,callback){
        this.connection.query("select * from tasks where id=? and owner=?",[id,owner],(error,results,fields)=>{
            if(error) throw error
            callback(results)
        })
    }

    updateTask(sql,updateData,callback){
        this.connection.query("UPDATE tasks set "+sql+" WHERE id=? and owner=?",updateData, function (error, results, fields) {
            if(error) throw error
            callback(results.affectedRows);
        });
    }

    deleteTask(id,owner,callback){
        this.connection.query("DELETE FROM tasks WHERE id=? and owner=?",[id,owner], function (error, results, fields) {
            if(error) throw error
            callback(results.affectedRows);
        });
    }
}
module.exports=Task;