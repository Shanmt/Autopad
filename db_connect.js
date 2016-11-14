var mysql = require('mysql');
var dbclient = mysql.createConnection({
    user: 'root',
    password: 'root',
    host: 'localhost'
});

exports.mysql = mysql;

//Connection pool configuration
var db_config_pool = {
    
   /* host     : '104.45.132.205',
    user     : 'stagadmin',
    password : 'pAssword1#',
    database : 'clubauto_cloud2'
   */
    host     : 'localhost',
    user     : 'root',
    password : '',
    database : 'clubauto_cloud2.3'
   
   /*
    host     : '191.237.47.2',
    user     : 'Admin',
    password : 'Password1!',
    database : 'clubauto_cloud2.1'      
    */
        

};

var conLocalPool = mysql.createPool(db_config_pool);
exports.conLocalPool = conLocalPool;
exports.dbclient = dbclient;



