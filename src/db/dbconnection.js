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
        this.connection.connect(function(err) {
            if (err) {
              console.error('error connecting: ' + err.stack);
              return;
            }
        });
    }
    dbConnectionEnd(){
        this.connection.end();
    }
}

module.exports= Database;
 
