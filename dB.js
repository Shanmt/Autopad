var db = require('./db_connect.js');


exports.db = function (functioname,str) {
    //call registerServiceStation('KazhakuttomMotors1','joshy','878987899','','4 Wheeler')
    var mysql = db.mysql;
    var conLocalPool = db.conLocalPool;

    conLocalPool.getConnection(function (err, con) {
        if (err) {
            if (con)
                con.release();
            console.log('Error while performing Query.' + functioname + err);
            return;
        }
        
        con.query(str, function (err, rows, fields) {
            if (err) {
                console.log('Error while performing Query.' +functioname + err);
                con.release();
            }
            else {
                con.release();
                return (rows[0]);
            }
                
          
        });

    });
};