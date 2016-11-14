var db = require('./db_connect.js');
var dateFormat = require('dateformat');

exports.logData = function (functionName, status, description) {
    //call registerServiceStation('KazhakuttomMotors1','joshy','878987899','','4 Wheeler')
    var mysql = db.mysql;
    var conLocalPool = db.conLocalPool;
    
    var str = '';
    var date = new Date();

    str = "call saveLog('" + functionName + "','" + description + "','" + status + "')";
    console.log(dateFormat(date,"mmm-dd h:MM:ss") + " " + functionName + " " + status);

    conLocalPool.getConnection(function (err, con) {
        if (err) {
            if (con)
                con.release();
            console.log('Error while performing Query.(gps_save_pool)' + err);
            return;
        }
        
        con.query(str, function (err, rows, fields) {
            if (err) {
                console.log('Error while performing Query.(gps_save_con)' + err);
                con.release();
            }
            else {
                con.release();
                return (rows[0]);
            }
                
          
        });

    });
};