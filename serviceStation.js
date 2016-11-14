
var db = require('./db_connect.js');


exports.registerServiceStation = function (serviceStationName, userFullName, userContactNumber, type, photourl) {
    //call registerServiceStation('KazhakuttomMotors1','joshy','878987899','','4 Wheeler')
    var mysql = db.mysql;
    var conLocalPool = db.conLocalPool;
    
    var str = '';
    str = "call registerServiceStation('" + serviceStationName + "','" + userFullName + "','" + userContactNumber + "','" + photourl + "', '" + type + "')";
    
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
                return(rows[0]);
            }
                
          
        });

    });
};