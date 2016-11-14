var http = require('http');
var url = require('url');
var log = require('./log.js');
var db = require('./db_connect.js');



exports.handle_insertUser = function (req, res) {
    
    req.parse_url = url.parse(req.url, true);
    var coreurl = req.parse_url.pathname;
    
    res.writeHead(200, { "Content-Type" : "application/json" });
    var mysql = db.mysql;
    var conLocalPool = db.conLocalPool;
    
    var userid;
    var ssid;
    
    userid = req.parse_url.query.userid;
    ssid = req.parse_url.query.ssid;
    var fullname = req.parse_url.query.fullname;
    var phone = req.parse_url.query.phone;
    var Type = req.parse_url.query.Type;
    
    var VerificationCode = Math.floor(Math.random() * (9999 - 1000) + 1000);
    
    var str = '';
    str = "call createOtherUsers('" + userid + "','" + ssid + "','" + fullname + "','" + phone + "','" + VerificationCode + "','" + Type + "')";
    
    conLocalPool.getConnection(function (err, con) {
        if (err) {
            if (con)
                con.release();
            console.log('Error while performing Query.(gps_save_pool) handle_insertUser' + err);
            res.end(JSON.stringify({ error: "Error while performing Query.(gps_save_pool) handle_insertUser" + err }) + "\n");
            log.logData('handle_insertUser', 'FAILURE', err);
            return;
        }
        con.query(str, function (err, rows, fields) {
            if (err) {
                console.log('Error while performing Query.(gps_save_con) handle_insertUser' + err);
                res.end(JSON.stringify({ error: "Error while performing Query.(gps_save_con) handle_insertUser" + err }) + "\n");
                log.logData('handle_insertUser', 'FAILURE', err);
            }
            else {
                log.logData('handle_insertUser', 'SUCCESS', rows[0]);
                res.end(JSON.stringify({ result: rows[0] }) + "\n");
                console.log(rows[0]);
            }
            con.release();
        });
    });
}

exports.handle_updateUser = function (req, res) {
    
    req.parse_url = url.parse(req.url, true);
    var coreurl = req.parse_url.pathname;
    
    res.writeHead(200, { "Content-Type" : "application/json" });
    var mysql = db.mysql;
    var conLocalPool = db.conLocalPool;
    
    var userid;
    var ssid;
    
    userid = req.parse_url.query.userid;
    ssid = req.parse_url.query.ssid;
    
    var UpdateUserid= req.parse_url.query.updateuserid;
    var fullname = req.parse_url.query.fullname;
    var phone = req.parse_url.query.phone;
    var Type = req.parse_url.query.Type;
    
    var VerificationCode = req.parse_url.query.Passcode;
    
    var str = '';
    str = "call updateOtherusers('" + userid + "','" + ssid + "','" + fullname + "','" + phone + "','" + VerificationCode + "','" + Type + "','" + UpdateUserid + "')";
    
    conLocalPool.getConnection(function (err, con) {
        if (err) {
            if (con)
                con.release();
            console.log('Error while performing Query.(gps_save_pool) handle_updateUser' + err);
            res.end(JSON.stringify({ error: "Error while performing Query.(gps_save_pool) handle_updateUser" + err }) + "\n");
            log.logData('handle_updateUser', 'FAILURE', err);
            return;
        }
        con.query(str, function (err, rows, fields) {
            if (err) {
                console.log('Error while performing Query.(gps_save_con) handle_updateUser' + err);
                res.end(JSON.stringify({ error: "Error while performing Query.(gps_save_con) handle_updateUser" + err }) + "\n");
                log.logData('handle_updateUser', 'FAILURE', err);
            }
            else {
                log.logData('handle_updateUser', 'SUCCESS', rows[0]);
                res.end(JSON.stringify({ result: rows[0] }) + "\n");
                console.log(rows[0]);
            }
            con.release();
          
        });

    });
}

exports.handle_deleteuser = function (req, res) {
    
    req.parse_url = url.parse(req.url, true);
    var coreurl = req.parse_url.pathname;
    
    res.writeHead(200, { "Content-Type" : "application/json" });
    var mysql = db.mysql;
    var conLocalPool = db.conLocalPool;
    
    var userid;
    var ssid;
    
    userid = req.parse_url.query.userid;
    ssid = req.parse_url.query.ssid;
    var deleteuserid = req.parse_url.query.deleteuserid;
    
    var str = '';
    str = "call deleteUser('" + userid + "','" + ssid + "','" + deleteuserid + "')";
    
    conLocalPool.getConnection(function (err, con) {
        if (err) {
            if (con)
                con.release();
            console.log('Error while performing Query.(gps_save_pool) handle_updateUser' + err);
            res.end(JSON.stringify({ error: "Error while performing Query.(gps_save_pool) handle_updateUser" + err }) + "\n");
            log.logData('handle_updateUser', 'FAILURE', err);
            return;
        }
        con.query(str, function (err, rows, fields) {
            if (err) {
                console.log('Error while performing Query.(gps_save_con) handle_updateUser' + err);
                res.end(JSON.stringify({ error: "Error while performing Query.(gps_save_con) handle_updateUser" + err }) + "\n");
                log.logData('handle_updateUser', 'FAILURE', err);
            }
            else {
                log.logData('handle_updateUser', 'SUCCESS', rows[0]);
                res.end(JSON.stringify({ result: rows[0] }) + "\n");
                console.log(rows[0]);
            }
            con.release();
          
        });

    });
}


exports.handle_selectUsers = function (req, res) {
    
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
    str = "call getUsers('" + userid + "','" + ssid + "')";
    
    conLocalPool.getConnection(function (err, con) {
        if (err) {
            if (con)
                con.release();
            console.log('Error while performing Query.(gps_save_pool) handle_selectUsers' + err);
            res.end(JSON.stringify({ error: "Error while performing Query.(gps_save_pool) handle_selectUsers" + err }) + "\n");
            log.logData('handle_selectUsers', 'FAILURE', err);
            return;
        }
        con.query(str, function (err, rows, fields) {
            if (err) {
                console.log('Error while performing Query.(gps_save_con) handle_selectUsers' + err);
                res.end(JSON.stringify({ error: "Error while performing Query.(gps_save_con) handle_selectUsers" + err }) + "\n");
                log.logData('handle_selectUsers', 'FAILURE', err);
            }
            else {
                log.logData('handle_selectUsers', 'SUCCESS', rows[0]);
                res.end(JSON.stringify({ result:'success',users: rows[1] }) + "\n");
                console.log(rows[0]);
            }
            con.release();
          
        });

    });
}