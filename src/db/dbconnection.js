class Database{
    constructor(){
        this.mysql      = require('mysql');
        this.connection = this.mysql.createConnection({
        host     : 'localhost',
        user     : 'root',
        password : '',
        database : 'task-manager'
        });
    }
    dbConnect(){
        this.connection.connect();
    }
    dbConnectionEnd(){
        this.connection.end();
    }
}

db=new Database();

module.exports= db;
 
