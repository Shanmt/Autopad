var http = require('http');
var url = require('url');
var log = require('./log.js');
var db = require('./db_connect.js');
var sms = require('./SMS.js');


exports.handle_customerImport = function (req, res) {
    
    req.parse_url = url.parse(req.url, true);
    var coreurl = req.parse_url.pathname;
    
    res.writeHead(200, { "Content-Type" : "application/json" });
    var mysql = db.mysql;
    var conLocalPool = db.conLocalPool;
    
    var userid;
    var ssid;
    
    var cname;
    var ccontact;
    var regid;
    var make;
    var model;

    
    userid = req.parse_url.query.userid;
    ssid = req.parse_url.query.ssid;

    cname = req.parse_url.query.cname;
    ccontact = req.parse_url.query.ccontact;
    regid = req.parse_url.query.regid;
    make = req.parse_url.query.make;
    model = req.parse_url.query.model;
    
    
    var str = '';
    str = "call getCustomerVisit('" + userid + "','" + ssid + "'," + days + ");";
    
    conLocalPool.getConnection(function (err, con) {
        if (err) {
            if (con)
                con.release();
            console.log('Error while performing Query.(handle_getCustomerVisit) ' + err);
            res.end(JSON.stringify({ error: "Error while performing Query.(gps_save_pool) handle_getCustomerVisit" + err }) + "\n");
            log.logData('handle_getCustomerVisit', 'FAILURE', err);
            return;
        }
        
        con.query(str, function (err, rows, fields) {
            if (err) {
                console.log('Error while performing Query.(gps_save_con) handle_getCustomerVisit' + err);
                res.end(JSON.stringify({ error: "Error while performing Query.(gps_save_con) handle_getCustomerVisit" + err }) + "\n");
                log.logData('handle_getCustomerVisit', 'FAILURE', err);
            }
            else {
                log.logData('handle_getCustomerVisit', 'SUCCESS', 'SUCCESS');
                
                if (rows[0].length > 0) {
                    res.end(JSON.stringify({ CustomerVisits: rows[0] }) + "\n");
                }
            }
            con.release();
          
        });

    });

}


exports.handle_getCustomerVisit = function (req, res) {
    
    req.parse_url = url.parse(req.url, true);
    var coreurl = req.parse_url.pathname;
    
    res.writeHead(200, { "Content-Type" : "application/json" });
    var mysql = db.mysql;
    var conLocalPool = db.conLocalPool;
    
    var userid;
    var ssid;
    var days;
    
    userid = req.parse_url.query.userid;
    ssid = req.parse_url.query.ssid;
    days = req.parse_url.query.days;
    
    
    var str = '';
    str = "call getCustomerVisit('" + userid + "','" + ssid + "'," + days + ");";
    
    conLocalPool.getConnection(function (err, con) {
        if (err) {
            if (con)
                con.release();
            console.log('Error while performing Query.(handle_getCustomerVisit) ' + err);
            res.end(JSON.stringify({ error: "Error while performing Query.(gps_save_pool) handle_getCustomerVisit" + err }) + "\n");
            log.logData('handle_getCustomerVisit', 'FAILURE', err);
            return;
        }
        
        con.query(str, function (err, rows, fields) {
            if (err) {
                console.log('Error while performing Query.(gps_save_con) handle_getCustomerVisit' + err);
                res.end(JSON.stringify({ error: "Error while performing Query.(gps_save_con) handle_getCustomerVisit" + err }) + "\n");
                log.logData('handle_getCustomerVisit', 'FAILURE', err);
            }
            else {
                log.logData('handle_getCustomerVisit', 'SUCCESS', 'SUCCESS');
                
                if (rows[0].length > 0) {
                    res.end(JSON.stringify({ CustomerVisits: rows[0] }) + "\n");
                }
            }
            con.release();
          
        });

    });

}

exports.handle_getCustomerList = function (req, res) {
    
    req.parse_url = url.parse(req.url, true);
    var coreurl = req.parse_url.pathname;
    
    res.writeHead(200, { "Content-Type" : "application/json" });
    var mysql = db.mysql;
    var conLocalPool = db.conLocalPool;
   
    var userid;
    var ssid;
    var search;

    userid = req.parse_url.query.userid;
    ssid = req.parse_url.query.ssid;
    search = req.parse_url.query.search;
    

    var str = '';
    str = "call listCustomers('" + userid + "','" + ssid + "','" + search + "');";
    
    conLocalPool.getConnection(function (err, con) {
        if (err) {
            if (con)
                con.release();
            console.log('Error while performing Query.(handle_getCustomerList) ' + err);
            res.end(JSON.stringify({ error: "Error while performing Query.(gps_save_pool) handle_getCustomerList" + err }) + "\n");
            log.logData('handle_getJobDetails', 'FAILURE', err);
            return;
        }
        
        con.query(str, function (err, rows, fields) {
            if (err) {
                console.log('Error while performing Query.(gps_save_con) handle_getCustomerList' + err);
                res.end(JSON.stringify({ error: "Error while performing Query.(gps_save_con) handle_getCustomerList" + err }) + "\n");
                log.logData('handle_getJobDetails', 'FAILURE', err);
            }
            else {
                log.logData('handle_getCustomerList', 'SUCCESS', rows[0]);
                
                if (rows[0].length > 0) {
                    res.end(JSON.stringify({ status: rows[0], CustomerDetails: rows[1] }) + "\n");
                }
            }
            con.release();
          
        });

    });

}


exports.handle_PurchaseSMS = function (req, res) {
    
    req.parse_url = url.parse(req.url, true);
    var coreurl = req.parse_url.pathname;
    
    res.writeHead(200, { "Content-Type" : "application/json" });
    var mysql = db.mysql;
    var conLocalPool = db.conLocalPool;
    
    var userid;
    var ssid;
    
    
    ssid = req.parse_url.query.ssid;
    amount = req.parse_url.query.amount;
    paymentmode = req.parse_url.query.paymentmode;
    smscount = req.parse_url.query.smscount;
    
    var str = '';
    str = "call PurchaseSMS('" + ssid + "'," + amount + ",'" + paymentmode + "'," + smscount + ");";
    
    conLocalPool.getConnection(function (err, con) {
        if (err) {
            if (con)
                con.release();
            console.log('Error while performing Query.(handle_PurchaseSMS) ' + err);
            res.end(JSON.stringify({ error: "Error while performing Query.(gps_save_pool) handle_PurchaseSMS" + err }) + "\n");
            log.logData('handle_PurchaseSMS', 'FAILURE', err);
            return;
        }
        
        con.query(str, function (err, rows, fields) {
            if (err) {
                console.log('Error while performing Query.(gps_save_con) handle_PurchaseSMS' + err);
                res.end(JSON.stringify({ error: "Error while performing Query.(gps_save_con) handle_PurchaseSMS" + err }) + "\n");
                log.logData('handle_PurchaseSMS', 'FAILURE', err);
            }
            else {
                log.logData('handle_PurchaseSMS', 'SUCCESS', rows[0]);
                if (rows[0].length > 0) {
                    res.end(JSON.stringify({ status: rows[0], SMSLog: rows[1] }) + "\n");
                }
            }
            con.release();
          
        });

    });

}


exports.handle_setJobCardDetails = function (req, res) {
    req.parse_url = url.parse(req.url, true);
    var coreurl = req.parse_url.pathname;
    
    res.writeHead(200, { "Content-Type" : "application/json" });
    var mysql = db.mysql;
    var conLocalPool = db.conLocalPool;
    
    var userid;
    var ssid;
    
    userid = req.parse_url.query.userid;
    ssid = req.parse_url.query.ssid;
    var jobid = req.parse_url.query.jobid;

    var spares = req.parse_url.query.spares;
    var estimates = req.parse_url.query.estimates;
    var discount = req.parse_url.query.discount;

    
    
    str = "call setJobCardDetails('" + userid + "','" + ssid + "','" + jobid + "','" + spares + "','" + estimates + "','" + discount + "')";
    
    conLocalPool.getConnection(function (err, con) {
        if (err) {
            if (con)
                con.release();
            console.log('Error while performing Query.(gps_save_pool) handle_setJobCardDetails' + err);
            res.end(JSON.stringify({ error: "Error while performing Query.(gps_save_pool) handle_setJobCardDetails" + err }) + "\n");
            log.logData('handle_setJobCardDetails', 'FAILURE', err);
            return;
        }
        
        con.query(str, function (err, rows, fields) {
            if (err) {
                console.log('Error while performing Query.(gps_save_con) handle_setJobCardDetails' + err);
                res.end(JSON.stringify({ error: "Error while performing Query.(gps_save_con) handle_setJobCardDetails" + err }) + "\n");
                log.logData('handle_setJobCardDetails', 'FAILURE', err);
            }
            else {
                log.logData('getVehicleStatusChange', 'SUCCESS', '');
                //Call SMS function 
                res.end(JSON.stringify({ status: 'SUCCESS' }));
            }
            con.release();
          
        });

    });
}


exports.handle_getJobCardDetails = function (req, res) {
    req.parse_url = url.parse(req.url, true);
    var coreurl = req.parse_url.pathname;
    
    res.writeHead(200, { "Content-Type" : "application/json" });
    var mysql = db.mysql;
    var conLocalPool = db.conLocalPool;
    
    var userid;
    var ssid;
    
    userid = req.parse_url.query.userid;
    ssid = req.parse_url.query.ssid;
    var jobid = req.parse_url.query.jobid;
    
    
    str = "call getJobCardDetails('" + userid + "','" + ssid + "','" + jobid + "')";
    
    conLocalPool.getConnection(function (err, con) {
        if (err) {
            if (con)
                con.release();
            console.log('Error while performing Query.(gps_save_pool) handle_getJobCardDetails' + err);
            res.end(JSON.stringify({ error: "Error while performing Query.(gps_save_pool) handle_getJobCardDetails" + err }) + "\n");
            log.logData('handle_getJobCardDetails', 'FAILURE', err);
            return;
        }
        
        con.query(str, function (err, rows, fields) {
            if (err) {
                console.log('Error while performing Query.(gps_save_con) handle_getJobCardDetails' + err);
                res.end(JSON.stringify({ error: "Error while performing Query.(gps_save_con) handle_getJobCardDetails" + err }) + "\n");
                log.logData('handle_getJobCardDetails', 'FAILURE', err);
            }
            else {
                log.logData('handle_getJobCardDetails', 'SUCCESS', '');
                //Call SMS function 
                res.end(JSON.stringify({ status: 'SUCCESS', JobDetails: rows[1] }));
            }
            con.release();
          
        });

    });
}

exports.handle_getBillingDetails = function (req, res) {
    req.parse_url = url.parse(req.url, true);
    var coreurl = req.parse_url.pathname;
    
    res.writeHead(200, { "Content-Type" : "application/json" });
    var mysql = db.mysql;
    var conLocalPool = db.conLocalPool;
    
    var userid;
    var ssid;
    
    userid = req.parse_url.query.userid;
    ssid = req.parse_url.query.ssid;
    var jobid = req.parse_url.query.jobid;
    
    
    str = "call getBillingDetails('" + userid + "','" + ssid + "','" + jobid + "')";
    
    conLocalPool.getConnection(function (err, con) {
        if (err) {
            if (con)
                con.release();
            console.log('Error while performing Query.(gps_save_pool) handle_getBillingDetails' + err);
            res.end(JSON.stringify({ error: "Error while performing Query.(gps_save_pool) handle_getBillingDetails" + err }) + "\n");
            log.logData('handle_getBillingDetails', 'FAILURE', err);
            return;
        }
        
        con.query(str, function (err, rows, fields) {
            if (err) {
                console.log('Error while performing Query.(gps_save_con) handle_getBillingDetails' + err);
                res.end(JSON.stringify({ error: "Error while performing Query.(gps_save_con) handle_getBillingDetails" + err }) + "\n");
                log.logData('handle_getBillingDetails', 'FAILURE', err);
            }
            else {
                log.logData('handle_getBillingDetails', 'SUCCESS', '');
                //Call SMS function 
                res.end(JSON.stringify({ status: 'SUCCESS', JobDetails: rows[1],BillDetails: rows[2],CustomerDetails: rows[3],StationDetails: rows[4]}));
            }
            con.release();
          
        });

    });
}


exports.handle_estimateDetails = function (req, res) {
    req.parse_url = url.parse(req.url, true);
    var coreurl = req.parse_url.pathname;
    
    res.writeHead(200, { "Content-Type" : "application/json" });
    var mysql = db.mysql;
    var conLocalPool = db.conLocalPool;
    
    var userid;
    var ssid;
    
    userid = req.parse_url.query.userid;
    ssid = req.parse_url.query.ssid;
    var jobid = req.parse_url.query.jobid;
    
    
    str = "call setEstimateValues('" + userid + "','" + ssid + "','" + jobid + "')";
    
    conLocalPool.getConnection(function (err, con) {
        if (err) {
            if (con)
                con.release();
            console.log('Error while performing Query.(gps_save_pool) handle_estimateDetails' + err);
            res.end(JSON.stringify({ error: "Error while performing Query.(gps_save_pool) handle_estimateDetails" + err }) + "\n");
            log.logData('handle_estimateDetails', 'FAILURE', err);
            return;
        }
        
        con.query(str, function (err, rows, fields) {
            if (err) {
                console.log('Error while performing Query.(gps_save_con) handle_estimateDetails' + err);
                res.end(JSON.stringify({ error: "Error while performing Query.(gps_save_con) handle_estimateDetails" + err }) + "\n");
                log.logData('handle_estimateDetails', 'FAILURE', err);
            }
            else {
                log.logData('handle_estimateDetails', 'SUCCESS', '');
                //Call SMS function 
                res.end(JSON.stringify({EstimateDetails: rows }));
            }
            con.release();
          
        });

    });
}