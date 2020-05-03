class Database{
    constructor(){
        this.mysql      = require('mysql');
        this.connection = this.mysql.createConnection({
        host     : process.env.HOST,
        user     : process.env.USERNAME,
        password : process.env.PASSWORD,
        database : process.env.DATABASE
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
 
