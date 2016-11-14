var http = require('http');
var url = require('url');
var log = require('./log.js');
var db = require('./db_connect.js');


exports.handle_serviceStationProfile = function (req, res) {
    
    req.parse_url = url.parse(req.url, true);
    var coreurl = req.parse_url.pathname;
    
    res.writeHead(200, { "Content-Type" : "application/json" });
    var mysql = db.mysql;
    var conLocalPool = db.conLocalPool;
    
    
    var userid;
    var ssid;
    var vehicleid;
    
    userid = req.parse_url.query.userid;
    ssid = req.parse_url.query.ssid;
    
    var str = '';
    str = "call serviceCentreDetails('" + userid + "','" + ssid + "');";
    
    conLocalPool.getConnection(function (err, con) {
        if (err) {
            if (con)
                con.release();
            console.log('Error while performing Query.(handle_serviceStationProfile) ' + err);
            res.end(JSON.stringify({ error: "Error while performing Query.(gps_save_pool) handle_serviceStationProfile" + err }) + "\n");
            log.logData('handle_serviceStationProfile', 'FAILURE', err);
            return;
        }
        
        con.query(str, function (err, rows, fields) {
            if (err) {
                console.log('Error while performing Query.(gps_save_con) handle_getCustomerList' + err);
                res.end(JSON.stringify({ error: "Error while performing Query.(gps_save_con) handle_serviceStationProfile" + err }) + "\n");
                log.logData('handle_serviceStationProfile', 'FAILURE', err);
            }
            else {
                log.logData('handle_serviceStationProfile', 'SUCCESS', rows[0]);
                
                if (rows[0].length > 0) {
                    res.end(JSON.stringify({ status: rows[0], serviceCenterDetails: rows[1] }) + "\n");
                }
            }
            con.release();
          
        });

    });

}