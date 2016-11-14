var http = require('http');
var url = require('url');
var log = require('./log.js');
var db = require('./db_connect.js');


exports.handle_getDashboard = function (req, res) {
    
    req.parse_url = url.parse(req.url, true);
    var coreurl = req.parse_url.pathname;
    
    res.writeHead(200, { "Content-Type" : "application/json" });
    var mysql = db.mysql;
    var conLocalPool = db.conLocalPool;
    
    
    var userid;
    var ssid;
    
    userid = req.parse_url.query.userid;
    ssid = req.parse_url.query.ssid;
    var str = '';
    str = "call getDashboardDetails('" + userid + "','" + ssid + "');";
    
    conLocalPool.getConnection(function (err, con) {
        if (err) {
            if (con)
                con.release();
            console.log('Error while performing Query.(handle_getDashboard) ' + err);
            res.end(JSON.stringify({ error: "Error while performing Query.(gps_save_pool) handle_getDashboard" + err }) + "\n");
            log.logData('handle_getDashboard', 'FAILURE', err);
            return;
        }
        
        con.query(str, function (err, rows, fields) {
            if (err) {
                console.log('Error while performing Query.(gps_save_con) handle_getDashboard' + err);
                res.end(JSON.stringify({ error: "Error while performing Query.(gps_save_con) handle_getDashboard" + err }) + "\n");
                log.logData('handle_getDashboard', 'FAILURE', err);
            }
            else {
                
                
                if (rows[0]!=undefined) {
                    res.end(JSON.stringify({ status: [{"value": 'SUCCESS'}], servicestation: rows[0], smsdetails: rows[1], otherfigures: rows[2], jobs: rows[3] }) + "\n");
                    log.logData('handle_getDashboard', 'SUCCESS', rows[0]);
                }
                else {
                    res.end(JSON.stringify({ status: [{ "value": 'SUCCESS' }], servicestation: "", smsdetails: "", otherfigures: "" }) + "\n");
                    log.logData('handle_getDashboard', 'FAILURE', 'no value');
                }

            }
            con.release();
          
        });

    });

}