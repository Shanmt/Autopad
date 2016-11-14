var http = require('http');
var url = require('url');
var log = require('./log.js');
var fs = require('fs');
var sms = require('./SMS.js');
var db = require('./db_connect.js');
var Customers = require('./Customers.js');
var Vehicles = require('./Vehicles.js');
var servicestation = require('./ServiceCentre.js');
const EventEmitter = require('events');

function handle_income_request(req, res) {
    
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    req.parse_url = url.parse(req.url, true);
    var coreurl = req.parse_url.pathname;
   
    if (coreurl == "/registerServiceStation") {
        handle_registerServiceStation(req, res);
    }
    else if (coreurl == "/getdropdownDetails") {
        handle_getdropdownDetails(req, res);
    }
    else if (coreurl == "/postjobdetails") {
        handle_postJobDetails(req, res);
    }
    else if (coreurl == "/searchVehicles") {
        handle_searchVehicles(req, res);
    }
    else if (coreurl == "/getCurrentVehicleList") {
        handle_getCurrentVehicleList(req, res);
    }
    else if (coreurl == "/getVehicleStatusChange") {
        handle_getVehicleStatusChange(req, res);
    }
    else if (coreurl == "/postVehicleImageUpload") {
        handle_postVehicleImageUpload(req, res);
    }
    else if (coreurl == "/getPendingSMS") {
        handle_getPendingSMS(req, res);
    }
    else if (coreurl == "/getSMSHistory") {
        handle_getSMSHistory(req, res);
    }
    else if (coreurl == "/serviceStationProfile") {
        servicestation.handle_serviceStationProfile(req, res);
    }
    else if (coreurl == "/getJobDetails") {
        handle_getJobDetails(req, res);
    }
    else if (coreurl == "/getVerified") {
        handle_getVerified(req, res);
    }
    else if (coreurl == "/setJobCardDetails") {
        Customers.handle_setJobCardDetails(req, res);
    }
    else if (coreurl == "/getJobCardDetails") {
        Customers.handle_getJobCardDetails(req, res);
    }
    else if (coreurl == "/getBillingDetails") { //GetBilling
        Customers.handle_getBillingDetails(req, res);
    }
    else if (coreurl == "/getEstimateDetails") {
        Customers.handle_estimateDetails(req, res);
    }
    else if (coreurl == "/getVehicleJobHistory") {
        Vehicles.handle_getVehicleJobHistory(req, res);
    }
    else if (coreurl == "/purchaseSMS") {
        Customers.handle_PurchaseSMS(req, res);
    }
    else if (coreurl == "/testSMS") {
        handle_testSMS(req, res);
    } else if (coreurl == "/getOTP") {
        handle_getOTP(req, res);
    }
    else if (coreurl == "/getCustomerList") {
        Customers.handle_getCustomerList(req, res);
    }
    else if (coreurl == "/getDashboard") {
        var ds = require('./Dashboard.js');
        ds.handle_getDashboard(req, res);
    }
    else if (coreurl == "/getCustomerVisit") {
        Customers.handle_getCustomerVisit(req, res);
    }
    else if (coreurl == "/customerImport") {
        Customers.handle_customerImport(req, res);
    }
    else if (coreurl == "/adminSMS") {
        handle_adminSMS(req, res);
    }
    //GetCustomJob
    else if (coreurl == "/getCustomJob") { 
        handle_getCustomJob(req, res);
    }
    //deleteCustomJob
    else if (coreurl == "/deleteCustomJob") {
        handle_deleteCustomJob(req, res);
    }
    //get all custom job
    else if (coreurl == "/allCustomJob") {
        handle_allCustomJob(req, res);
    }
    //Create custom job
    else if (coreurl == "/createCustomJob") {
        handle_createCustomJob(req,res)
    }
    //Update Billing
    else if (coreurl == "/createbilling") {
        handle_updateBill(req, res);
    }  
    /*
    CRUD User
    else if (coreurl == "/createUsers") {
        handle_createUsers(req, res);
    }
    else if (coreurl == "/addUsers") {
        handle_addUsers(req, res);
    } 
    else if (coreurl == "/editUsers") {
        handle_editUsers(req, res);
    }    
    else if (coreurl == "/deleteUsers") {
        handle_deleteUsers(req, res);
    }
    CRUD User ends
    */ 
    //set Summary
    else if (coreurl == "/setSummary") {
        handle_setSummary(req, res);
    } 
    /*
    //get all Roles
    else if (coreurl == "/getallRoles") {
        handle_getallRoles(req,res);
    }*/
    //get Reminders info

    else if (coreurl == "/getallRemindersInfo") {
        handle_getallRemindersInfo(req,res);
    }
     //checkPrintBillStatus
    else if(coreurl == "/checkBillStatus"){ 
        handle_billStatus(req,res);
    }
    //Upload Photo
    else if (coreurl == "/setServiceStationLogo") {
        handle_uploadPhoto(req, res);
    }
    else {
        res.writeHead(200, { "Content-Type" : "application/json" });
        res.end(JSON.stringify({ error: "Jekree, what is this....wrong url" }) + "\n");
    }
}


function handle_adminSMS(req, res) {
    
    req.parse_url = url.parse(req.url, true);
    var coreurl = req.parse_url.pathname;
    
    res.writeHead(200, { "Content-Type" : "application/json" });
    var mysql = db.mysql;
    var conLocalPool = db.conLocalPool;
    
   
    var passcode;
     
  
    passcode = req.parse_url.query.passcode;
    
    if (passcode == 'Auto@123Pad') {
        
        var str = '';
        str = "call smsServiceStationStatus();";
        
        conLocalPool.getConnection(function (err, con) {
            if (err) {
                if (con)
                    con.release();
                console.log('Error while performing Query.(handle_adminSMS) ' + err);
                res.end(JSON.stringify({ error: "Error while performing Query.(gps_save_pool) handle_adminSMS" + err }) + "\n");
                log.logData('handle_adminSMS', 'FAILURE', err);
                return;
            }
            
            con.query(str, function (err, rows, fields) {
                if (err) {
                    console.log('Error while performing Query.(gps_save_con) handle_adminSMS' + err);
                    res.end(JSON.stringify({ error: "Error while performing Query.(gps_save_con) handle_adminSMS" + err }) + "\n");
                    log.logData('handle_getJobDetails', 'FAILURE', err);
                }
                else {
                    log.logData('handle_adminSMS', 'SUCCESS', rows[0]);
                    var str = "Dear [CUSTOMER],%0aThis weeks summary of [SERVICECENTRE] based on AutoPad usage.%0a%0aVehicles IN: [IN]%0aVehicles Delivered: [DELIVERED]%0aOn Time Delivery: [ONTIME]%0aDelayed delivery:[DELAYED]%0aVehicles in Garage: [GARAGE]%0a%0aThanks for being a part of AutoPad. For assistance contact Rajesh : 9447857234 ";

                    if (rows[0].length > 0) {
                        var message = '';
                        for (var i=0; i < rows[0].length; i++) {
                            message = str.replace('[CUSTOMER]', rows[0][i].contactperson);
                            message = message.replace('[SERVICECENTRE]', rows[0][i].servicestation);
                            message = message.replace('[IN]', rows[0][i].TotalVehiclesIn);
                            message = message.replace('[DELIVERED]', rows[0][i].TotalVehilcesDelivered);
                            message = message.replace('[ONTIME]', rows[0][i].OnTimedelivery);
                            message = message.replace('[DELAYED]', rows[0][i].DelayedDelivery);
                            message = message.replace('[GARAGE]', rows[0][i].VehiclesInGarage);

                            console.log(message);
                            sms.SMSData('Admin', message, rows[0][i].contactnumber, 'Admin', 'MOTORS', function (err) {
                                if (err)
                                    console.log("error in sending sms");
                                else
                                    ee1.emit('error', err);
                            });
                            

                        }

                        res.end(JSON.stringify({ vehicle: rows }) + "\n");
                    
                    }
                }
                con.release();
          
            });

        });
    }
    else {
        console.log('Incorrect Password' );
        res.end(JSON.stringify({ error: "Incorrect Password" + err }) + "\n");
    }

}

function handle_getJobDetails(req, res) {
    
    req.parse_url = url.parse(req.url, true);
    var coreurl = req.parse_url.pathname;
    
    res.writeHead(200, { "Content-Type" : "application/json" });
    var mysql = db.mysql;
    var conLocalPool = db.conLocalPool;
    
    var jobid;
    var passcode;
    var userid;
    var ssid;
    
    jobid = req.parse_url.query.jobid;
    userid = req.parse_url.query.userid;
    ssid = req.parse_url.query.ssid;
    
    
    var str = '';
    str = "call jobDetails('" + userid + "','" + ssid + "','" + jobid + "');";
    
    conLocalPool.getConnection(function (err, con) {
        if (err) {
            if (con)
                con.release();
            console.log('Error while performing Query.(handle_getJobDetails) ' + err);
            res.end(JSON.stringify({ error: "Error while performing Query.(gps_save_pool) handle_getJobDetails" + err }) + "\n");
            log.logData('handle_getOTP', 'FAILURE', err);
            return;
        }
        
        con.query(str, function (err, rows, fields) {
            if (err) {
                console.log('Error while performing Query.(gps_save_con) handle_getJobDetails' + err);
                res.end(JSON.stringify({ error: "Error while performing Query.(gps_save_con) handle_getJobDetails" + err }) + "\n");
                log.logData('handle_getJobDetails', 'FAILURE', err);
            }
            else {
                log.logData('handle_getJobDetails', 'SUCCESS', rows[0]);
                
                if (rows[0].length > 0) {
                    
                    var message = "Dear customer, your password for AutoCare app is " + rows[0][0].verificationcode;
                    res.end(JSON.stringify({ vehicle: rows }) + "\n");
                    
                }
            }
            con.release();
          
        });

    });

}

function handle_getOTP(req, res) {
    
    req.parse_url = url.parse(req.url, true);
    var coreurl = req.parse_url.pathname;
    
    res.writeHead(200, { "Content-Type" : "application/json" });
    var mysql = db.mysql;
    var conLocalPool = db.conLocalPool;
    
    var contact;
    var passcode;
    //var ssid;
    
    contact = req.parse_url.query.contact;
    //ssid = req.parse_url.query.ssid;
    
    
    var str = '';
    str = "call getVerificationCode('" + contact + "');";
    
    conLocalPool.getConnection(function (err, con) {
        if (err) {
            if (con)
                con.release();
            console.log('Error while performing Query.(gps_save_pool) handle_getOTP' + err);
            res.end(JSON.stringify({ error: "Error while performing Query.(gps_save_pool) handle_getOTP" + err }) + "\n");
            log.logData('handle_getOTP', 'FAILURE', err);
            return;
        }
        
        con.query(str, function (err, rows, fields) {
            if (err) {
                console.log('Error while performing Query.(gps_save_con) handle_getOTP' + err);
                res.end(JSON.stringify({ error: "Error while performing Query.(gps_save_con) handle_getOTP" + err }) + "\n");
                log.logData('handle_getOTP', 'FAILURE', err);
            }
            else {
                log.logData('handle_getOTP', 'SUCCESS', rows[0]);
                
                if (rows[0].length > 0) {
                    
                    var message = "Dear customer, your password for AutoCare app is " + rows[0][0].verificationcode;
                    res.end(JSON.stringify({ result: rows[0] }) + "\n");
                    sms.SMSData('Admin', message, contact, 'Admin','MOTORS', function (err) {
                        if (err)
                            console.log("error in sending sms");
                        else
                            ee1.emit('error', err);
                    });
                }
                else {
                    log.logData('handle_getOTP' + ' Invalid number' + contact, 'failure', 'Invalid number' + contact);
                    res.end(JSON.stringify({ error: "Invalid Number " + contact }) + "\n");
                }
            }
            con.release();
          
        });

    });

}

function handle_getVerified(req, res) {
    
    req.parse_url = url.parse(req.url, true);
    var coreurl = req.parse_url.pathname;
    
    res.writeHead(200, { "Content-Type" : "application/json" });
    var mysql = db.mysql;
    var conLocalPool = db.conLocalPool;
    
    var contact;
    var passcode;
    //var ssid;
     
    contact = req.parse_url.query.contactnumber;
    passcode = req.parse_url.query.Passcode;

    //ssid = req.parse_url.query.ssid;
    var verfificationCode = req.parse_url.query.verificationcode;
   
    var str = '';
    str = "call checkLogin('" + contact + "','" + passcode + "')";
    
    conLocalPool.getConnection(function (err, con) {
        if (err) {
            if (con)
                con.release();
            console.log('Error while performing Query.(gps_save_pool) handle_getVerified' + err);
            res.end(JSON.stringify({ error: "Error while performing Query.(gps_save_pool) handle_getVerified" + err }) + "\n");
            log.logData('handle_getVerified', 'FAILURE', err);
            return;
        }
        con.query(str, function (err, rows, fields) {
            if (err) {
                console.log('Error while performing Query.(gps_save_con) handle_getVerified' + err);
                res.end(JSON.stringify({ error: "Error while performing Query.(gps_save_con) handle_getVerified" + err }) + "\n");
                log.logData('handle_getVerified', 'FAILURE', err);
            }
            else {
                    log.logData('handle_getVerified', 'SUCCESS',rows[0]);
                    res.end(JSON.stringify({ result: rows[0] }) + "\n");
                   
            }
            con.release();
          
        });

    });
}

function handle_getSMSHistory(req, res) {
    
    req.parse_url = url.parse(req.url, true);
    var coreurl = req.parse_url.pathname;
    
    res.writeHead(200, { "Content-Type" : "application/json" });
    var mysql = db.mysql;
    var conLocalPool = db.conLocalPool;
    
    var userid;
    var ssid;
    var daycount;
    
    userid = req.parse_url.query.userid;
    ssid = req.parse_url.query.ssid;
    daycount = req.parse_url.query.daycount;

    var search = req.parse_url.query.search;
    var vehiclestatus = req.parse_url.query.vehiclestatus;
    
    if (ssid == undefined || userid == undefined) {
        res.end(JSON.stringify({ error: "Please enter Userid & service stationid" }) + "\n");
        return;
    }
    
    
    var str = '';
    str = "call getSMSLogHistory('" + userid + "','" + ssid + "'," + daycount + ")";
    
    conLocalPool.getConnection(function (err, con) {
        if (err) {
            if (con)
                con.release();
            console.log('Error while performing Query.(gps_save_pool) handle_getSMSHistory' + err);
            res.end(JSON.stringify({ error: "Error while performing Query.(gps_save_pool) handle_getSMSHistory" + err }) + "\n");
            log.logData('handle_getSMSHistory', 'FAILURE', err);
            return;
        }
        
        con.query(str, function (err, rows, fields) {
            if (err) {
                console.log('Error while performing Query.(gps_save_con) handle_getSMSHistory' + err);
                res.end(JSON.stringify({ error: "Error while performing Query.(gps_save_con) handle_getSMSHistory" + err }) + "\n");
                log.logData('handle_getSMSHistory', 'FAILURE', err);
            }
            else {
                if (rows[0].length > 0) {
                    log.logData('handle_getSMSHistory', 'SUCCESS', '');
                    res.end(JSON.stringify({ result: rows[0] }) + "\n");
                   

                }
                else {
                    log.logData('NO History', 'SUCCESS', '');
                    res.end(JSON.stringify({ result: [{ PendingSMS: 0 }] }) + "\n");
                    console.log("No History");

                }
            }
            con.release();
          
        });

    });
}

function handle_getPendingSMS(req, res) {
    
    req.parse_url = url.parse(req.url, true);
    var coreurl = req.parse_url.pathname;
    
    res.writeHead(200, { "Content-Type" : "application/json" });
    var mysql = db.mysql;
    var conLocalPool = db.conLocalPool;
    
    var userid;
    var ssid;
    
    
    userid = req.parse_url.query.userid;
    ssid = req.parse_url.query.ssid;
    var search = req.parse_url.query.search;
    var vehiclestatus = req.parse_url.query.vehiclestatus;
    
    if (ssid == undefined || userid == undefined) {
        res.end(JSON.stringify({ error: "Please enter Userid & service stationid" }) + "\n");
        return;
    }
    
    
    var str = '';
    str = "call getPendingSMS('" + userid + "','" + ssid + "')";
    
    conLocalPool.getConnection(function (err, con) {
        if (err) {
            if (con)
                con.release();
            console.log('Error while performing Query.(gps_save_pool) handle_getPendingSMS' + err);
            res.end(JSON.stringify({ error: "Error while performing Query.(gps_save_pool) handle_getPendingSMS" + err }) + "\n");
            log.logData('handle_getPendingSMS', 'FAILURE', err);
            return;
        }
        
        con.query(str, function (err, rows, fields) {
            if (err) {
                console.log('Error while performing Query.(gps_save_con) handle_getPendingSMS' + err);
                res.end(JSON.stringify({ error: "Error while performing Query.(gps_save_con) handle_getPendingSMS" + err }) + "\n");
                log.logData('handle_getPendingSMS', 'FAILURE', err);
            }
            else {
                if (rows.length > 0) {
                    
                    if (rows[0].length > 0) {
                        log.logData('handle_getPendingSMS', 'SUCCESS', '');
                        res.end(JSON.stringify({ result: rows[0] }) + "\n");
                  

                    }
                    else {
                        log.logData('NO SMS', 'SUCCESS', '');
                        res.end(JSON.stringify({ result: [{ PendingSMS: 0 }] }) + "\n");
                        console.log("No SMS");

                    }
                }
                else {
                    log.logData('ERROR NO SMS', 'SUCCESS', '');
                    console.log("ERROR No SMS" + rows);
                }
            }
            con.release();
          
        });

    });
}

function handle_testSMS(req, res) {
   
}

function handle_postVehicleImageUpload(req, res) {
    
    console.log("function called");

    

    fs.readFile(req.files.image.path, function (err, data) {
        console.log(req.files.image.originalFilename);
        console.log(req.files.image.path);
        var dirname = "/images/";
        var newpath = "/images/" + req.files.image.originalFilename;
        
        fs.writeFile(newPath, data, function (err) {
            if (err)
                res.json({ 'response': "error" });
            else
                res.json({ 'response': "saved" }); b
                     
        }); 
    });
    
}

function handle_getVehicleStatusChange(req, res) {
    //call changeVehicleStatus ('3549b6db-ce9a-11e5-a800-fcaa1492285f',	'3549b74f-ce9a-11e5-a800-fcaa1492285f','e968732c-cfde-11e5-90c4-fcaa1492285f','ATTENDED',1200);
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
    var status = req.parse_url.query.status;
    var finalamount = req.parse_url.query.finalamount;
    var nextService = req.parse_url.query.nextService;
    var dontsendSMS = req.parse_url.query.noSMS;
    
    if (nextService == undefined || nextService == '') {
        nextService = '180';
    }

    if (finalamount == '') finalamount = 0;

    if (ssid == undefined || userid == undefined) {
        res.end(JSON.stringify({ error: "Please enter Userid & service stationid" }) + "\n");
        return;
    }
    
    
    var str = '';
    if (finalamount == undefined)
        finalamount = "0";
    
    


    str = "call changeVehicleStatusNew('" + userid + "','" + ssid + "','" + jobid + "','" + status + "',"  + finalamount + "," + nextService + ")";
    
    conLocalPool.getConnection(function (err, con) {
        if (err) {
            if (con)
                con.release();
            console.log('Error while performing Query.(gps_save_pool) handle_getVehicleStatusChange' + err);
            res.end(JSON.stringify({ error: "Error while performing Query.(gps_save_pool) handle_getVehicleStatusChange" + err }) + "\n");
            log.logData('getVehicleStatusChange', 'FAILURE', err);
            return;
        }
        
        con.query(str, function (err, rows, fields) {
            if (err) {
                console.log('Error while performing Query.(gps_save_con) handle_getVehicleStatusChange' + err);
                res.end(JSON.stringify({ error: "Error while performing Query.(gps_save_con) handle_getVehicleStatusChange" + err }) + "\n");
                log.logData('getVehicleStatusChange', 'FAILURE', err);
            }
            else {
                log.logData('getVehicleStatusChange', 'SUCCESS', '');
                //Call SMS function 
                if (dontsendSMS == '' || dontsendSMS ==undefined) {
                    if (status == "COMPLETED") {
                        
                        sendJobCompletedSMS(userid, ssid, jobid, function (err) {
                            if (err) {
                                //error in sending SMS;
                                log.logData('sendJobCompletedSMS', 'FAILURE', err);
                            }
                            else {
                                console.log("SMS sent");
                            }
                        });
                    }
                }
                else {
                    log.logData('sendJobCompletedSMS', 'SMS NOT SENT', '');
                    console.log("SMS not sent");
                }
                res.end(JSON.stringify({ status: rows[0], VehicleDetails: rows[1] }) + "\n");
            }
            con.release();
          
        });

    });
}

function handle_getCurrentVehicleList(req, res) {

    req.parse_url = url.parse(req.url, true);
    var coreurl = req.parse_url.pathname;
    
    res.writeHead(200, { "Content-Type" : "application/json" });
    var mysql = db.mysql;
    var conLocalPool = db.conLocalPool;
    
    var userid;
    var ssid;
    
    
    userid = req.parse_url.query.userid;
    ssid = req.parse_url.query.ssid;
    var search = req.parse_url.query.search;
    var vehiclestatus = req.parse_url.query.vehiclestatus;

    if (ssid == undefined || userid == undefined) {
        res.end(JSON.stringify({ error: "Please enter Userid & service stationid" }) + "\n");
        return;
    }
    
    var str = '';
    str = "call searchVehicleswithStatus('" + userid + "','" + ssid + "','" + search + "')";
    
    conLocalPool.getConnection(function (err, con) {
        if (err) {
            if (con)
                con.release();
            console.log('Error while performing Query.(gps_save_pool) handle_getCurrentVehicleList' + err);
            res.end(JSON.stringify({ error: "Error while performing Query.(gps_save_pool) handle_getCurrentVehicleList" + err }) + "\n");
            log.logData('getCurrentVehicleList', 'FAILURE', err);
            return;
        }
        
        con.query(str, function (err, rows, fields) {
            if (err) {
                console.log('Error while performing Query.(gps_save_con) handle_getCurrentVehicleList' + err);
                res.end(JSON.stringify({ error: "Error while performing Query.(gps_save_con) handle_getCurrentVehicleList" + err }) + "\n");
                log.logData('getCurrentVehicleList', 'FAILURE', err);
            }
            else {
                log.logData('getCurrentVehicleList', 'SUCCESS', '');
                res.end(JSON.stringify({ status: rows[0], VehicleDetails: rows[1] }) + "\n");
            }
            con.release();
        });

    });
}

function handle_searchVehicles(req, res) {
    req.parse_url = url.parse(req.url, true);
    var coreurl = req.parse_url.pathname;
    
    res.writeHead(200, { "Content-Type" : "application/json" });
    var mysql = db.mysql;
    var conLocalPool = db.conLocalPool;
    
    var userid;
    var ssid;
    
    userid = req.parse_url.query.userid;
    ssid = req.parse_url.query.ssid;
    var search = req.parse_url.query.search;
    
    if (ssid == undefined || userid == undefined) {
        res.end(JSON.stringify({ error: "Please enter Userid & service stationid" }) + "\n");
        return;
    }
    
    var str = '';
    str = "call listCustomers('" + userid + "','" +  ssid+"','" + search +"')";
    
    conLocalPool.getConnection(function (err, con) {
        if (err) {
            if (con)
                con.release();
            console.log('Error while performing Query.(gps_save_pool) handle_searchVehicles' + err);
            res.end(JSON.stringify({ error: "Error while performing Query.(gps_save_pool) handle_searchVehicles" + err }) + "\n");
            
            log.logData('handle_searchVehicles', 'FAILURE', err);
            return;
        }
        
        con.query(str, function (err, rows, fields) {
            if (err) {
                console.log('Error while performing Query.(gps_save_con) handle_searchVehicles' + err);
                res.end(JSON.stringify({ error: "Error while performing Query.(gps_save_con) handle_searchVehicles" + err }) + "\n");
                log.logData('handle_searchVehicles', 'FAILURE', err);
            }
            else {
                log.logData('handle_searchVehicles', 'SUCCESS', '');
                res.end(JSON.stringify({ status: rows[0], VehicleDetails: rows[1] }) + "\n");
            }
            con.release();
          
        });

    });
}

function handlepostJobUpdates(req, res, json) {
    //Find change in Jobs
    //Find Change in Dates 
    //Find Change in Amount 
   
    
    var SMSStringNew = "Dear [CUSTOMERNAME],%0aBelow are the job updates for your vehicle [VEHICLENUMBER]%0a[NEWJOBS][CANCELLEDJOBS][CHEIFCOMPLAINT][NEWDATE][NEWAMOUNT][SSNAME], [SSCONTACTPHONE]";
    
    
    //Cut from the else 
    
    var userid;
    var ssid;
    userid = json.userid;
    ssid = json.ssid;
    
    //Take vehicile details;
    var regid = json.Vehicle.registration;
    regid = regid.toUpperCase();
    var mobile = json.Vehicle.mobile;
    var customername = json.Vehicle.customerName;
    //Adding new field
    var cheifComplaint = json.Vehicle.chiefcomplaint;
    
    var make = json.Vehicle.make;
    var model = json.Vehicle.model;
    
    var photo = json.Vehicle.photourl;
    var status = json.Vehicle.status;
    var estimatedtime = json.Vehicle.estimateddate;
    var estimatedamount = json.Vehicle.estimatedamount;
    var engineno = json.Advanced.engineno;
    var chasisno = json.Advanced.chasisno;
    var customerid;
    var jobid = json.Vehicle.jobid;
    var jobs = json.JobDetails;

    var str = '';
    str = "call jobDetails('" + userid + "','" + ssid + "','" + jobid + "');";
    

    var mysql = db.mysql;
    var conLocalPool = db.conLocalPool;
    var jobLocalPool = db.conLocalPool;
    var vehLocalPool = db.conLocalPool;

    conLocalPool.getConnection(function (err, con) {
        if (err) {
            if (con)
                con.release();
            console.log('Error while performing Query.(handlepostJobUpdates) ' + err);
            res.end(JSON.stringify({ error: "Error while performing Query.(gps_save_pool) handlepostJobUpdates" + err }) + "\n");
            log.logData('handlepostJobUpdates', 'FAILURE', err);
            return;
        }
        
        con.query(str, function (err, rows, fields) {
            if (err) {
                console.log('Error while performing Query.(gps_save_con) handlepostJobUpdates' + err);
                res.end(JSON.stringify({ error: "Error while performing Query.(gps_save_con) handlepostJobUpdates" + err }) + "\n");
                log.logData('handlepostJobUpdates', 'FAILURE', err);
            }
            else {
                log.logData('handlepostJobUpdates', 'SUCCESS', rows[0]);
                if (rows[0].length > 0) {
                    var dateformat = require('dateformat');
                    var dateval = dateformat(rows[0][0].estimateendtime, 'dd-mm-yyyy hh:MM TT')
                    
                    SMSStringNew = SMSStringNew.replace("[CUSTOMERNAME]", customername);
                    SMSStringNew = SMSStringNew.replace("[VEHICLENUMBER]", regid);
                    

                    if (dateval != estimatedtime) {
                        //Date is different. 
                        if (estimatedtime == null) {
                            SMSStringNew = SMSStringNew.replace("[NEWDATE]", 'The Estimated date will be informed later' + '%0a');
                        }
                        else {
                            SMSStringNew = SMSStringNew.replace("[NEWDATE]", 'The new delivery date is ' + estimatedtime + '%0a');
                        }
                    }
                    else
                        SMSStringNew = SMSStringNew.replace("[NEWDATE]", '');

                   
                    if (estimatedamount != rows[0][0].estimateamount) {
                        SMSStringNew = SMSStringNew.replace("[NEWAMOUNT]", 'The new Estimated Amount is Rs ' + estimatedamount + '%0a');
                    }
                    else
                        SMSStringNew = SMSStringNew.replace("[NEWAMOUNT]", '');
                    
                    if (cheifComplaint != rows[0][0].cheifcomplaint) {
                        SMSStringNew = SMSStringNew.replace("[CHEIFCOMPLAINT]", 'The Updated Chief complaint is ' + cheifComplaint + '%0a');
                    }
                    else
                        SMSStringNew = SMSStringNew.replace("[CHEIFCOMPLAINT]", '');
                    

                    for (var i = 0; i < jobs.length ; i++) {
                        for (var j = 0; j < rows[1].length; j++) {
                            if (jobs[i].jobid == rows[1][j].jobid) {
                                jobs[i].jobdescription = "true";
                                rows[1][j].jobdescription = "true";
                            }
                        }
                    }
                    var newString='';
                    for (i = 0; i < jobs.length ; i++) {
                        if (jobs[i].jobdescription == '') {
                            newExists = true;
                            if (newString != '')
                                newString += ', ' + jobs[i].jobname;
                            else
                                newString = jobs[i].jobname;
                        }
                    }
                    var cancelString='';

                    for (j = 0; j < rows[1].length; j++) {
                        if (rows[1][j].jobdescription == '')
                            if (cancelString != '') { cancelString += ', ' + rows[1][j].jobname; }
                            else {
                                cancelString = rows[1][j].jobname;
                            }
                    }
                    
                    if (newString != '') 
                        SMSStringNew = SMSStringNew.replace("[NEWJOBS]", 'New Job(s) ' + newString + '%0a');
                    else
                        SMSStringNew = SMSStringNew.replace("[NEWJOBS]", '');

                    
                    if (cancelString != '')
                        SMSStringNew = SMSStringNew.replace("[CANCELLEDJOBS]", 'Cancelled Job(s) ' + cancelString + '%0a');
                    else
                        SMSStringNew = SMSStringNew.replace("[CANCELLEDJOBS]", '');
                    //Edit the data and send SMS to the data 

                    //CUT FROM NEW JOB 
                    
                    if (estimatedtime == null) {
                        var dtNew = new Date();
                        dtNew.setDate(90);
                        estimatedtime= dateformat(dtNew.toString(), 'dd-mm-yyyy hh:MM TT')
                    }
                    //
                    var str = "call createCustomer('" + userid + "','" + ssid + "','" + regid + "','" + mobile + "','" + customername + "','" + make + "','" + model + "','" + photo + "','" + status + "','" + estimatedtime + "'," + estimatedamount + ",'" + jobid + "','" + cheifComplaint + "','" + engineno + "','" + chasisno + "')";
   
                    var vehjobs = [];
                    
                    vehLocalPool.getConnection(function (err, con1) {
                        if (err) {
                            if (con1)
                                con1.release();
                            console.log('Error while performing  Job Update.(gps_save_pool)' + err);
                            res.end(JSON.stringify({ error: "Error while performing Job Update" + err }) + "\n");
                            log.logData('Job Update', 'FAILURE', err);
                            return;
                        }
                        
                        con1.query(str, function (err, rows1, fields) {
                            if (err) {
                                console.log('Error while performing  Job Update.(gps_save_con)' + err);
                                res.end(JSON.stringify({ error: "Error while performing  Job Update.(gps_save_con)" + err }) + "\n");
                                log.logData(' Job Update', 'FAILURE', err);
                            }
                            else {
                                customerjobid = rows1[0][0]._customerjobid;
                                customerid = rows1[0][0]._Customerid;
                                
                                
                                
                                res.end(JSON.stringify({ error: null, vehicle: rows1[0] }));
                                console.log(rows);
                                var SMSJobString = "";
                                //INSERT ADVANCED FEATURES BEFORE INSERTING JOB DETAILS. 
                                
                                addAdvanced(json, customerjobid);
                                
                                //INSERT VEHICLE JOB DETAILS;
                                //LOOP THROUGH ALL THE JOBS
                                var pending = json.JobDetails.length;
                                if (json.JobDetails.length > 0) {
                                    for (i = 0; i < json.JobDetails.length; i++) {
                                        str = "insert into customerjobdetails (customerjobid,jobid,jobname,jobdescription,createddate,ssid)  values ('" + customerjobid + "','" + json.JobDetails[i].jobid + "','" + json.JobDetails[i].jobname + "','',now(),'" + ssid + "')";
                                        console.log(str);
                                        if (i == 0) {
                                            if (json.JobDetails.length == 1) {
                                                postJobSMS(userid, ssid, SMSStringNew, mobile, customerid, function (err) {
                                                    if (err) {
                                                        console.log("Error in sending SMS");
                                                        log.logData('ERROR in SMS postJobDetails', 'FAILURE', err);
                                                    }
                                                });
                                            }

                                        }
                                        else if (i == json.JobDetails.length - 1) {
                                            postJobSMS(userid, ssid, SMSStringNew, mobile, customerid, function (err) {
                                                if (err) {
                                                    console.log("Error in sending SMS");
                                                    log.logData('ERROR in SMS postJobDetails', 'FAILURE', err);
                                                }
                                            });

                                        }
                                       
                                        vehLocalPool.query(str, function (err, res, fields) {
                                            if (err == null) {
                                                vehjobs.push(res);
                                                if (0 == --pending) {
                                                    console.log(str);
                                                }
                                            }
                                        });

                                    }
                        
                                } else {
                                    //Send SMS Without Job
                                    SMSString = SMSString.replace("[JOBS]", "");
                                    postJobSMS(userid, ssid, SMSStringNew, mobile, customerid, function (err) {
                                        if (err) {
                                            console.log("Error in sending SMS");
                                            log.logData('ERROR in SMS postJobDetails', 'FAILURE', err);
                                        }
                                    });
                                }
                                log.logData('postJobDetails', 'SUCCESS', '');
                            }
                            con1.release();
                        });

                    });
                    //CUT FROM NEW JOB
                    res.end(JSON.stringify({ error: null, vehicle: rows[0] }));
                }
            }
            con.release();
        });

    });

}

function handlepostNewJob(req, res, json) {
    //var SMSStringNew = "Dear [CUSTOMERNAME]%0aYour vehicle([VEHICLENUMBER]) job details are [JOBS]%0a[CHEIFCOMPLAINS]%0aThe estimated delivery date [ESTIMATEDATE] and approximate amount [ESTIMATEAMOUNT].%0a[SSCONTACTPERSON], [SSCONTACTPHONE]%0a[SSNAME]";
    var SMSStringNew = "Dear [CUSTOMERNAME]%0aThank you for visiting [SSNAME].%0a%0aYour vehicle([VEHICLENUMBER]) is received and Job details are : [JOBS]%0a[CHEIFCOMPLAINS]%0aEst Amt [ESTIMATEAMOUNT]%0aEst delivery [ESTIMATEDATE]%0a%0a[SSCONTACTPERSON], [SSCONTACTPHONE]";
    
    var SMSString = "";
    
    //Cut from the else 
    var dateformat = require('dateformat');
    var userid;
    var ssid;
    userid = json.userid;
    ssid = json.ssid;
    
    //Take vehicile details;
    var regid = json.Vehicle.registration;
    regid = regid.toUpperCase();
    var mobile = json.Vehicle.mobile;
    var customername = json.Vehicle.customerName;
    //Adding new field
    var cheifComplaint = json.Vehicle.chiefcomplaint;
    
    var make = json.Vehicle.make;
    var model = json.Vehicle.model;
    
    var photo = json.Vehicle.photourl;
    var status = json.Vehicle.status;
    var estimatedtime = json.Vehicle.estimateddate;
    var estimatedamount = json.Vehicle.estimatedamount;
    var engineno = json.Advanced.engineno;
    var chasisno = json.Advanced.chasisno;
    var customerid;
    var jobid = json.Vehicle.jobid;
  
    SMSString = SMSStringNew;
    
   
    SMSString = SMSString.replace("[VEHICLENUMBER]", regid);
    if (estimatedtime == null) {
        SMSString = SMSString.replace("[ESTIMATEDATE]", ' will be informed later');
    } else {
        SMSString = SMSString.replace("[ESTIMATEDATE]", ' is ' + estimatedtime);
    }
    
    if (estimatedamount == undefined || parseInt(estimatedamount)==0 ) {
        SMSString = SMSString.replace("[ESTIMATEAMOUNT]", " will be informed later");
    }
    else {
        SMSString = SMSString.replace("[ESTIMATEAMOUNT]", " is Rs " + estimatedamount);
    }
    
    if (cheifComplaint != '') {
        SMSString = SMSString.replace("[CHEIFCOMPLAINS]", "The cheif complaints are :" + cheifComplaint + "%0a");
    }
    else {
        SMSString = SMSString.replace("[CHEIFCOMPLAINS]", "");
    }
    
    //Call the SP functions
    //call createCustomer('3549b6db-ce9a-11e5-a800-fcaa1492285f','3549b74f-ce9a-11e5-a800-fcaa1492285f', 'KL01AP9650','1122334455','JOHN1','Hyundai','Verna','','unattended','9/2/2016 16:20',100,0)
    if (estimatedtime == null) {
        var dtNew = new Date();
        dtNew.setDate(90);
        estimatedtime = dateformat(dtNew.toString(), 'dd-mm-yyyy hh:MM TT')
    }
    

    var customerjobid;
    var str = "call createCustomer('" + userid + "','" + ssid + "','" + regid + "','" + mobile + "','" + customername + "','" + make + "','" + model + "','" + photo + "','" + status + "','" + estimatedtime + "'," + estimatedamount + ",'" + jobid + "','" + cheifComplaint + "','" + engineno + "','" + chasisno + "')";
    var mysql = db.mysql;
    var conLocalPool = db.conLocalPool;
    var vehLocalPool = db.conLocalPool;
    var vehjobs = [];
    
    
    
    conLocalPool.getConnection(function (err, con) {
        if (err) {
            if (con)
                con.release();
            console.log('Error while performing Query.(gps_save_pool)' + err);
            res.end(JSON.stringify({ error: "Error while performing Query.(gps_save_pool)" + err }) + "\n");
            log.logData('postJobDetails', 'FAILURE', err);
            return;
        }
        
        con.query(str, function (err, rows, fields) {
            if (err) {
                console.log('Error while performing Query.(gps_save_con)' + err);
                res.end(JSON.stringify({ error: "Error while performing Query.(gps_save_con)" + err }) + "\n");
                log.logData('postJobDetails', 'FAILURE', err);
            }
            else {
                customerjobid = rows[0][0]._customerjobid;
                customerid = rows[0][0]._Customerid;
                customername = rows[0][0]._Customername;
                
               
                SMSString = SMSString.replace("[CUSTOMERNAME]", customername);
                res.end(JSON.stringify({ error: null, vehicle: rows[0] }));
                console.log(rows);
                var SMSJobString = "";
                //INSERT ADVANCED FEATURES BEFORE INSERTING JOB DETAILS. 
                
                addAdvanced(json, customerjobid);
                
                //INSERT VEHICLE JOB DETAILS;
                //LOOP THROUGH ALL THE JOBS
                var pending = json.JobDetails.length;
                if (json.JobDetails.length > 0) {
                    for (i = 0; i < json.JobDetails.length; i++) {
                        str = "insert into customerjobdetails (customerjobid,jobid,jobname,jobdescription,createddate,ssid)  values ('" + customerjobid + "','" + json.JobDetails[i].jobid + "','" + json.JobDetails[i].jobname + "','" + json.JobDetails[i].jobdescription + "',now(),'" + ssid + "')";
                        console.log(str);
                        if (i == 0) {
                            SMSJobString = json.JobDetails[i].jobname
                            
                            if (json.JobDetails.length == 1) {
                                
                                SMSString = SMSString.replace("[JOBS]", SMSJobString + ".");
                                postJobSMS(userid, ssid, SMSString, mobile, customerid, function (err) {
                                    if (err) {
                                        console.log("Error in sending SMS");
                                        log.logData('ERROR in SMS postJobDetails', 'FAILURE', err);
                                    }
                                });
                            }

                        }
                        else if (i == json.JobDetails.length - 1) {
                            SMSJobString += " and  " + json.JobDetails[i].jobname;
                            SMSString = SMSString.replace("[JOBS]", SMSJobString + ".");
                            
                            postJobSMS(userid, ssid, SMSString, mobile, customerid, function (err) {
                                if (err) {
                                    console.log("Error in sending SMS");
                                    log.logData('ERROR in SMS postJobDetails', 'FAILURE', err);
                                }
                            });

                        }
                        else {
                            SMSJobString += ", " + json.JobDetails[i].jobname;
                        }
                        vehLocalPool.query(str, function (err, res, fields) {
                            if (err == null) {
                                vehjobs.push(res);
                                if (0 == --pending) {
                                    console.log(str);
                                }
                            }
                        });

                    }
                        
                } else {
                    //Send SMS Without Job
                    SMSString = SMSString.replace("[JOBS]", "");
                    postJobSMS(userid, ssid, SMSString, mobile, customerid, function (err) {
                        if (err) {
                            console.log("Error in sending SMS");
                            log.logData('ERROR in SMS postJobDetails', 'FAILURE', err);
                        }
                    });
                }
                log.logData('postJobDetails', 'SUCCESS', '');
            }
            con.release();
        });

    });

    //CUT FROM THE ELSE REGION 
}

function handle_postJobDetails(req, res) {
    
    console.log("Incoming post data" + req.method);
    var json_data = "";
    res.writeHead(200, { "Content-Type" : "application/json" });
    req.on(
        "readable",
        function () {
            var d = req.read();
            if (typeof d == 'string')
                json_data += d;
            else if (typeof d == 'object' && d instanceof Buffer)
                json_data += d.toString("utf8");
        }
    );

    req.on("end", function () {
        var out = "";
        if (!json_data)
            res.end(JSON.stringify({ error: "no JSON data" }) + "\n");
        else {
            var json;
            try {
                json = JSON.parse(json_data);
            } catch (e) { }
        }
        if (!json)
            res.end(JSON.stringify({ error: "Invalid JSON data" }) + "\n");
        else {
            // out = "Valid json " + json_data;
            
            //validate with user id and ssid first
            var jobid = json.Vehicle.jobid;

            if (jobid.length > 15) {
                
                handlepostJobUpdates(req, res, json);
            }
            else {
                handlepostNewJob(req, res, json);
            }
           
        }
        //res.end(out);
    }
    );
}



addAdvanced = function (json, jobid) {
    

    var mysql = db.mysql;
    var conLocalPool = db.conLocalPool;
    
    var userid;
    var ssid;
    
    userid = json.userid;
    ssid = json.ssid;

    var fuelLevel = json.Advanced.fuelLevel;
    var mechanicname = json.Advanced.mechanicname;
    var odometerreading = json.Advanced.odometer;
    var milege = json.Advanced.milege;
    var servicebooklet = json.Advanced.serviceBooklet;
    var sparewheel = json.Advanced.sparewheel;
    var jackandhandle = json.Advanced.jackandhandle;
     var toolkit = json.Advanced.toolkit;
    var mats = json.Advanced.mats;
    var mudflaps = json.Advanced.mudflaps;
    var stereo = json.Advanced.stereo;
    var clock = json.Advanced.clock;
    var wheelCaps = json.Advanced.wheelCaps;
    var crack = json.Advanced.crack;
    var dent = json.Advanced.dent;
    var scratch = json.Advanced.scratch;
    var others = json.Advanced.others;
    
    var insuranceexp = json.Advanced.insurance;
    var fitnessexp = json.Advanced.fitness;
    var emissionexp = json.Advanced.emission;
    
    if (insuranceexp == undefined)
        insuranceexp = '';
    if (fitnessexp == undefined)
        fitnessexp = '';
    if (emissionexp == undefined)
        emissionexp = '';

    

    var str = '';
    str = "call createAdvancedFeatures ('" + jobid + "'," + fuelLevel + ",'" + userid + "', '" + mechanicname + "', " + odometerreading + ", " + milege + ", " + servicebooklet + ", " + sparewheel + ", " + jackandhandle + ", " + toolkit + ", " + mats + ", " + mudflaps + ", " + stereo + ", " + clock + ", " + wheelCaps + ",'" + crack + "', '" + dent + "', '" + scratch + "', '" + others + "', '" + insuranceexp + "', '" + fitnessexp + "', '" + emissionexp + "')";

    
    conLocalPool.getConnection(function (err, con) {
        if (err) {
            if (con)
                con.release();
            console.log('Error while performing Query.(addAdvanced) addAdvanced' + err);
            
            log.logData('addAdvanced', 'FAILURE', err);
            return;
        }
        
        con.query(str, function (err, rows, fields) {
            if (err) {
                console.log('Error while performing Query.(addAdvanced) ' + err);
               
                log.logData('addAdvanced', 'FAILURE', err);
            }
            else {
                log.logData('addAdvanced', 'SUCCESS', '');
              
            }
            con.release();
          
        });

    });
}

postJobSMS = function (userid, ssid, SMSString, contactnumber, customerid) {
    var mysql = db.mysql;
    var conLocalPool = db.conLocalPool;
    
    var str = "call getServiceStation ('" + ssid + "')";
    conLocalPool.getConnection(function (err, con) {
        if (err) {
            if (con)
                con.release();
            console.log('Error while performing Query.(gps_save_pool) postJobSMS' + err);
            log.logData('postJobSMS', 'FAILURE', err);
            return "error";
        }
        
        con.query(str, function (err, rows, fields) {
            if (err) {
                console.log('Error while performing Query.(gps_save_con) postJobSMS' + err);
                log.logData('postJobSMS', 'FAILURE', err);
                status = "error";
            }
            else {
                //from the rows, find the 
                SMSString = SMSString.replace("[SSNAME]", rows[0][0].servicestation);
                SMSString = SMSString.replace("[SSCONTACTPERSON]", rows[0][0].contactperson);
                SMSString = SMSString.replace("[SSCONTACTPHONE]", rows[0][0].contactnumber);
                
                var senderid = rows[0][0].SenderID;

                console.log(SMSString);

                log.logData('sendJobCompletedSMS', 'SUCCESS', '');
                
                //var conLocalPool = db.conLocalPool;

                sms.SMSData(ssid, SMSString, contactnumber, customerid,senderid, function (err) {
                    if (err) {
                        console.log("error in sending sms");
                    }
                });
                                
            }
            con.release();
            
        });

    });


}

sendJobCompletedSMS = function (userid, ssid, jobid) {
    var mysql = db.mysql;
    var conLocalPool = db.conLocalPool;
    
    var str = "call getCustomerDetailsfromJob ('" + jobid + "','" + ssid + "')";
    var status = "";
    
    conLocalPool.getConnection(function (err, con) {
        if (err) {
            if (con)
                con.release();
            console.log('Error while performing Query.(gps_save_pool) handle_getCurrentVehicleList' + err);
            log.logData('sendJobCompletedSMS', 'FAILURE', err);
            return "error";
        }
        
        con.query(str, function (err, rows, fields) {
            if (err) {
                console.log('Error while performing Query.(gps_save_con) handle_getCurrentVehicleList' + err);
                log.logData('sendJobCompletedSMS', 'FAILURE', err);
                status = "error";
            }
            else {
                //from the rows, find the 
                var jobend = "Dear [NAME], your vehicle [VEHICLENUMBER] is ready for delivery.%0a The final bill amount is Rs [FINALAMOUNT]. %0a [SSNAME],[SSNO]";
                jobend = jobend.replace("[NAME]", rows[0][0].customername);
                jobend = jobend.replace("[FINALAMOUNT]", rows[0][0].actualamount);
                jobend = jobend.replace("[VEHICLENUMBER]", rows[0][0].registrationid);
                jobend = jobend.replace("[SSNAME]", rows[0][0].servicestation);
                jobend = jobend.replace("[SSNO]", rows[0][0].contactnumber);
                var senderid = rows[0][0].SenderID;

                log.logData('sendJobCompletedSMS', 'SUCCESS', '');
                status = "success";
                
                //var conLocalPool = db.conLocalPool;
                sms.SMSData(ssid, jobend, rows[0][0].contact, rows[0][0].customerid, senderid, function (err) {
                    if (err)
                        console.log("error in sending sms");
                    else
                        ee1.emit('error', err);
                });
                
            }
            con.release();
            return status;
        });

    });

    //str = "call logSMS ('"+ ssid +"','" +  + "',1)";
}

function handle_registerServiceStation(req, res) {
    
    
    req.parse_url = url.parse(req.url, true);
    var coreurl = req.parse_url.pathname;
    
    res.writeHead(200, { "Content-Type" : "application/json" });
    
    
    var mysql = db.mysql;
    var conLocalPool = db.conLocalPool;
    
    var serviceStationName = 'KXm3';
    var userFullName='john';
    var userContactNumber='8606889900';
    var photourl='';
    var _type='4WHEELER';
    
    serviceStationName = req.parse_url.query.SSName;
    userFullName = req.parse_url.query.FullName;
    userContactNumber = req.parse_url.query.phone;
    photourl = req.parse_url.query.photoname;
    _type = req.parse_url.query.SStype;
    
    if (serviceStationName == undefined) {
        res.end(JSON.stringify({ error: "PLEASE ENTER SERVICE STATIONNAME" }) + "\n");
        return;
    }
    if (userFullName == undefined) {
        res.end(JSON.stringify({ error: "PLEASE ENTER CONTACT NAME" }) + "\n");
        return;
    }
    
    if (userContactNumber == undefined) {
        res.end(JSON.stringify({ error: "PLEASE ENTER SERVICE CONTACT NUMBER"}) + "\n");
        return;
    }
    
    if (_type == undefined) {
        res.end(JSON.stringify({ error: "PLEASE ENTER SERVICE station type ( 4WHEELER  OR 2WHEELER )"  }) + "\n");
        return;
    }
    
    var VerificationCode = Math.floor(Math.random() * (9999 - 1000) + 1000);

    var str = '';
    str = "call registerServiceStation('" + serviceStationName + "','" + userFullName + "','" + userContactNumber + "','" + photourl + "', '" + _type + "', '" + VerificationCode + "')";
    
    conLocalPool.getConnection(function (err, con) {
        if (err) {
            if (con)
                con.release();
            console.log('Error while performing Query.(gps_save_pool)' + err);
            res.end(JSON.stringify({ error: "Error while performing Query.(gps_save_pool)" + err }) + "\n");
            log.logData('registerServiceStation', 'FAILURE', err);
            return;
        }
        
        con.query(str, function (err, rows, fields) {
            if (err) {
                console.log('Error while performing Query.(gps_save_con)' + err);
                res.end(JSON.stringify({ error: "Error while performing Query.(gps_save_con)" + err  }) + "\n");
                log.logData('registerServiceStation', 'FAILURE', err);
            }
            else {
				console.log(rows[0][0].SUCESS);
                //Send the verification code as an SMS to the customer. 
				 if (rows[0][0].SUCESS == "SUCESS") {
					 
					var VerificationMessage ="Dear " + userFullName + ", thank you for joining AutoPAD family. Your verification code is " + VerificationCode
					sms.SMSData("REGISTRATION", VerificationMessage, userContactNumber, rows[0][0]._servicestationid,'MOTORS', function (err) {
						console.log("verification log sent to customer" + VerificationCode);
					}
					);
					log.logData('registerServiceStation', 'SUCCESS', '');
				 }else
				 {
					log.logData('registerServiceStation', 'FAILURE', '');
				 }

                res.end(JSON.stringify({ error: null,message: rows }) + "\n");
                
            }
            con.release();
          
        });

    });

}

function handle_editCustomJob(req, res) {

    req.parse_url = url.parse(req.url, true);
    var coreurl = req.parse_url.pathname;
    
    res.writeHead(200, { "Content-Type" : "application/json" });
    var mysql = db.mysql;
    var conLocalPool = db.conLocalPool;
    
    var userid;
    var ssid;
    
    
    
    ssid = req.parse_url.query.ssid;
      

    if (ssid == undefined) {
        res.end(JSON.stringify({ error: "Please enter Service stationid" }) + "\n");
        return;
    }
    
    var str = '';
    str = "call editCustomJob('" + ssid + "')";
    
    conLocalPool.getConnection(function (err, con) {
        if (err) {
            if (con)
                con.release();
            console.log('Error while performing Query.(gps_save_pool) handle_editCustomJob' + err);
            res.end(JSON.stringify({ error: "Error while performing Query.(gps_save_pool) handle_editCustomJob" + err }) + "\n");
            log.logData('editCustomJob', 'FAILURE', err);
            return;
        }
        
        con.query(str, function (err, rows, fields) {
            if (err) {
                console.log('Error while performing Query.(gps_save_con) handle_editCustomJob' + err);
                res.end(JSON.stringify({ error: "Error while performing Query.(gps_save_con) handle_editCustomJob" + err }) + "\n");
                log.logData('editCustomJob', 'FAILURE', err);
            }
            else {
                log.logData('editCustomJob', 'SUCCESS', '');
                res.end(JSON.stringify({ status: rows[0], JobDetails: rows[1] }) + "\n");
            }
            con.release();
        });

    });


}

function handle_getCustomJob(req, res) {

    req.parse_url = url.parse(req.url, true);
    var coreurl = req.parse_url.pathname;
    
    res.writeHead(200, { "Content-Type" : "application/json" });
    var mysql = db.mysql;
    var conLocalPool = db.conLocalPool; 
    
    var jobid;
    var ssid;
    
    
    
    ssid = req.parse_url.query.ssid;
    jobid = req.parse_url.query.jobid;
      

    if (ssid == undefined || jobid == undefined) {
        res.end(JSON.stringify({ error: "Please enter Service stationid and Job Id" }) + "\n");
        return;
    }
    
    var str = '';
    str = "call getCustomJob('" + ssid + "','" + jobid + "')";
    
    conLocalPool.getConnection(function (err, con) {
        if (err) {
            if (con)
                con.release();
            console.log('Error while performing Query.(gps_save_pool) handle_getCustomJob' + err);
            res.end(JSON.stringify({ error: "Error while performing Query.(gps_save_pool) handle_getCustomJob" + err }) + "\n");
            log.logData('getCustomJob', 'FAILURE', err);
            return;
        }
        
        con.query(str, function (err, rows, fields) {
            if (err) {
                console.log('Error while performing Query.(gps_save_con) handle_getCustomJob' + err);
                res.end(JSON.stringify({ error: "Error while performing Query.(gps_save_con) handle_getCustomJob" + err }) + "\n");
                log.logData('getCustomJob', 'FAILURE', err);
            }
            else {
                log.logData('getCustomJob', 'SUCCESS', '');
                res.end(JSON.stringify({ status: rows[0], JobDetails: rows[1] }) + "\n");
            }
            con.release();
        });

    });


}

function handle_deleteCustomJob(req, res) {

    req.parse_url = url.parse(req.url, true);
    var coreurl = req.parse_url.pathname;
    
    res.writeHead(200, { "Content-Type" : "application/json" });
    var mysql = db.mysql;
    var conLocalPool = db.conLocalPool; 
    
    var jobid;
    var ssid;
    
    
    
    ssid = req.parse_url.query.ssid;
    jobid = req.parse_url.query.jobid;
      

    if (ssid == undefined || jobid == undefined) {
        res.end(JSON.stringify({ error: "Please enter Service stationid and Job Id" }) + "\n");
        return;
    }
    
    var str = '';
    str = "call deleteJobItems('" + ssid + "','" + jobid + "')";
    
    conLocalPool.getConnection(function (err, con) {
        
        if (err) {
            if (con)
                con.release();
            console.log('Error while performing Query.(gps_save_pool) handle_deleteCustomJob' + err);
            res.end(JSON.stringify({ error: "Error while performing Query.(gps_save_pool) handle_deleteCustomJob" + err }) + "\n");
            log.logData('deleteCustomJob', 'FAILURE', err);
            return;
        }
        
        con.query(str, function (err, rows, fields) {
            if (err) {
                console.log('Error while performing Query.(gps_save_con) handle_deleteCustomJob' + err);
                res.end(JSON.stringify({ error: "Error while performing Query.(gps_save_con) handle_deleteCustomJob" + err }) + "\n");
                log.logData('deleteCustomJob', 'FAILURE', err);
            }
            else {
                log.logData('deleteCustomJob', 'SUCCESS', '');
                res.end(JSON.stringify({ status: rows[0], JobDetails: rows[1] }) + "\n");
            }
            con.release();
        });

    });


}

function handle_allCustomJob(req, res) {

    req.parse_url = url.parse(req.url, true);
    var coreurl = req.parse_url.pathname;
    
    res.writeHead(200, { "Content-Type" : "application/json" });
    var mysql = db.mysql;
    var conLocalPool = db.conLocalPool; 
    
    var jobid;
    var ssid;
    
    
    
    ssid = req.parse_url.query.ssid;
    
      

    if (ssid == undefined) {
        res.end(JSON.stringify({ error: "Please enter Service stationid and Job Id" }) + "\n");
        return;
    }
    
    var str = '';
    str = "call getAllJobs('" + ssid + "')";
    
    conLocalPool.getConnection(function (err, con) {
        if (err) {
            if (con)
                con.release();
            console.log('Error while performing Query.(gps_save_pool) handle_getCustomJob' + err);
            res.end(JSON.stringify({ error: "Error while performing Query.(gps_save_pool) handle_getCustomJob" + err }) + "\n");
            log.logData('getCustomJob', 'FAILURE', err);
            return;
        }
        
        con.query(str, function (err, rows, fields) {
            if (err) {
                console.log('Error while performing Query.(gps_save_con) handle_getCustomJob' + err);
                res.end(JSON.stringify({ error: "Error while performing Query.(gps_save_con) handle_getCustomJob" + err }) + "\n");
                log.logData('getCustomJob', 'FAILURE', err);
            }
            else {
                log.logData('getCustomJob', 'SUCCESS', '');
                res.end(JSON.stringify({ status: rows[0], JobDetails: rows[1] }) + "\n");
            }
            con.release();
        });

    });


}

function handle_getdropdownDetails(req, res) {

    req.parse_url = url.parse(req.url, true);
    var coreurl = req.parse_url.pathname;

    res.writeHead(200, { "Content-Type" : "application/json" });
    var mysql = db.mysql;
    var conLocalPool = db.conLocalPool;
    
    var userid ;
    var ssid ;
  
    
    userid = req.parse_url.query.userid;
    ssid = req.parse_url.query.ssid;
  
    
    if (ssid == undefined || userid ==undefined) {
        res.end(JSON.stringify({ error: "Please enter Userid & service stationid" }) + "\n");
        return;
    }
    
    
    var str = '';
    str = "call getDropdownValues('" +userid + "','" + ssid + "')";
    
    conLocalPool.getConnection(function (err, con) {
        if (err) {
            if (con)
                con.release();
            console.log('Error while performing Query.(gps_save_pool) handle_getdropdownDetails' + err);
            res.end(JSON.stringify({ error: "Error while performing Query.(gps_save_pool) handle_getdropdownDetails" + err }) + "\n");
            log.logData('getdropdownDetails', 'FAILURE',err);
            return;
        }
        
        con.query(str, function (err, rows, fields) {
            if (err) {
                console.log('Error while performing Query.(gps_save_con) handle_getdropdownDetails' + err);
                res.end(JSON.stringify({ error: "Error while performing Query.(gps_save_con) handle_getdropdownDetails" + err }) + "\n");
                log.logData('getdropdownDetails', 'FAILURE', err);
            }
            else {
                
                res.end(JSON.stringify({ status: rows[0],MAKEMODEL: rows[1],JOBMASTER:rows[2]}) + "\n");
                log.logData('getdropdownDetails', 'SUCCESS', '');
            }
            con.release();
          
        });

    });

}
function handle_getBilling(req, res) {

    req.parse_url = url.parse(req.url, true);
    var coreurl = req.parse_url.pathname;

    res.writeHead(200, { "Content-Type" : "application/json" });
    var mysql = db.mysql;
    var conLocalPool = db.conLocalPool;
    
    var billno;
    var ssid;
  
    
    
    ssid = req.parse_url.query.ssid;
    billno = req.parse_url.query.billno;
  
    
    if (ssid == undefined || billno ==undefined) {
        res.end(JSON.stringify({ error: "Please enter Billno & service stationid" }) + "\n");
        return;
    }
    
    
    var str = '';
    str = "call getBilling('" +ssid + "','" + billno + "')";
    
    conLocalPool.getConnection(function (err, con) {
        
        if (err) {
            if (con)
                con.release();
            console.log('Error while performing Query.(gps_save_pool) handle_getBilling' + err);
            res.end(JSON.stringify({ error: "Error while performing Query.(gps_save_pool) handle_getBilling" + err }) + "\n");
            log.logData('getBilling', 'FAILURE',err);
            return;
        }
        
        con.query(str, function (err, rows, fields) {
            if (err) {
                console.log('Error while performing Query.(gps_save_con) handle_getBilling' + err);
                res.end(JSON.stringify({ error: "Error while performing Query.(gps_save_con) handle_getBilling" + err }) + "\n");
                log.logData('getBilling', 'FAILURE', err);
            }
            else {
                
                res.end(JSON.stringify({ status: rows[0],Billing: rows[1]}) + "\n");
                log.logData('getBilling', 'SUCCESS', '');
            }
            con.release();
          
        });


    });

}

function handle_createCustomJob(req, res) {
    
    console.log("Incoming post data" + req.method);
    var json_data = "";
    res.writeHead(200, { "Content-Type" : "application/json" });
    req.on(
        "readable",
        function () {
            var d = req.read();
            if (typeof d == 'string')
                json_data += d;
            else if (typeof d == 'object' && d instanceof Buffer)
                json_data += d.toString("utf8");
        }
    );

    req.on("end", function () {
        var out = "";
        if (!json_data)
            res.end(JSON.stringify({ error: "no JSON data" }) + "\n");
        else {
            var json;
            try {
                json = JSON.parse(json_data);
            } catch (e) { }
        }
        if (!json)
            res.end(JSON.stringify({ error: "Invalid JSON data" }) + "\n");
        else {
            // out = "Valid json " + json_data;
            
            //validate with user id and ssid first
            var ssid = json.ssid;

            
            handlepostCustomJob(req, res, json);
            
           
        }
        //res.end(out);
    }
    );
}

function handlepostCustomJob(req, res, json) {

   
    var mysql = db.mysql;
    var conLocalPool = db.conLocalPool;

   
    ssid = json.ssid;
    category = json.JobDetails[0].jobcategory;
    jobname  = json.JobDetails[0].jobname;
    jobdesc  = json.JobDetails[0].jobdescription;
    jobid = json.JobDetails[0].jobid;
    if(jobid == undefined){
        jobid = 0;
    }
    
    if (ssid == undefined || category ==undefined || jobname == undefined) {
         
        res.end(JSON.stringify({ error: "Please enter Userid & service stationid" }) + "\n");
        return;
    }
    
    
    var str = '';
    str = "call createCustomJob('" +ssid + "','" + category + "','" + jobname + "','" + jobdesc + "','" + jobid + "')";
   
   
    conLocalPool.getConnection(function (err, con) {
        if (err) {
            if (con)
                con.release();
            console.log('Error while performing Query.(gps_save_pool) handle_createCustomJob' + err);
            res.end(JSON.stringify({ error: "Error while performing Query.(gps_save_pool) handle_createCustomJob" + err }) + "\n");
            log.logData('createCustomJob', 'FAILURE',err);
            return;
        }
       
        con.query(str, function (err, rows, fields) {
            if (err) {
                console.log('Error while performing Query.(gps_save_con) handle_createCustomJob' + err);
                res.end(JSON.stringify({ error: "Error while performing Query.(gps_save_con) handle_createCustomJob" + err }) + "\n");
                log.logData('createCustomJob', 'FAILURE', err);
            }
            else {
                
                res.end(JSON.stringify({ status: rows[0]}) + "\n");
                log.logData('createCustomJob', 'SUCCESS', '');
            }
            con.release();
          
        });

    });


}

function handle_dailySummary(req, res, json) {

    req.parse_url = url.parse(req.url, true);
    var coreurl = req.parse_url.pathname;

    res.writeHead(200, { "Content-Type" : "application/json" });
    var mysql = db.mysql;
    var conLocalPool = db.conLocalPool;
    
    var ssid;
  
    
    ssid = req.parse_url.query.ssid;
  
    
    if (ssid == undefined) {
        res.end(JSON.stringify({ error: "Please enter Service Station Id" }) + "\n");
        return;
    }
    
    
    var str = '';
    str = "call getDailySummary('" + ssid + "')";
    
    conLocalPool.getConnection(function (err, con) {
        if (err) {
            if (con)
                con.release();
            console.log('Error while performing Query.(gps_save_pool) handle_dailySummary' + err);
            res.end(JSON.stringify({ error: "Error while performing Query.(gps_save_pool) handle_dailySummary" + err }) + "\n");
            log.logData('dailySummary', 'FAILURE',err);
            return;
        }
        
        con.query(str, function (err, rows, fields) {
            if (err) {
                console.log('Error while performing Query.(gps_save_con) handle_dailySummary' + err);
                res.end(JSON.stringify({ error: "Error while performing Query.(gps_save_con) handle_dailySummary" + err }) + "\n");
                log.logData('dailySummary', 'FAILURE', err);
            }
            else {
                
                res.end(JSON.stringify({ dailyReport: rows[0]}) + "\n");
                log.logData('dailySummary', 'SUCCESS', '');
            }
            con.release();
          
        });

    });



}

function handle_deleteUsers(req, res, json) {

    req.parse_url = url.parse(req.url, true);
    var coreurl = req.parse_url.pathname;

    res.writeHead(200, { "Content-Type" : "application/json" });
    var mysql = db.mysql;
    var conLocalPool = db.conLocalPool;
    
    var userid;
  
    
    userid = req.parse_url.query.userid;
  
    
    if (userid == undefined) {
        
        res.end(JSON.stringify({ error: "Please enter User Id" }) + "\n");
        return;

    }
    
    
    var str = '';
    str = "call getdeleteUsers('" + userid + "')";
    
    conLocalPool.getConnection(function (err, con) {
        if (err) {
            if (con)
                con.release();
            console.log('Error while performing Query.(gps_save_pool) handle_getdeleteUsers' + err);
            res.end(JSON.stringify({ error: "Error while performing Query.(gps_save_pool) handle_getdeleteUsers" + err }) + "\n");
            log.logData('getdeleteUsers', 'FAILURE',err);
            return;
        }
        
        con.query(str, function (err, rows, fields) {
            
            if (err) {
                console.log('Error while performing Query.(gps_save_con) handle_getdeleteUsers' + err);
                res.end(JSON.stringify({ error: "Error while performing Query.(gps_save_con) handle_getdeleteUsers" + err }) + "\n");
                log.logData('getdeleteUsers', 'FAILURE', err);
            }
            else {
                
                res.end(JSON.stringify({ dailyReport: rows[0]}) + "\n");
                log.logData('getdeleteUsers', 'SUCCESS', '');
            }

            con.release();
          
        });

    });



}



function handle_updateBill(req, res) {

    req.parse_url = url.parse(req.url, true);
    var coreurl = req.parse_url.pathname;

    res.writeHead(200, { "Content-Type" : "application/json" });
    var mysql = db.mysql;
    var conLocalPool = db.conLocalPool;
    
    var userid;
    var ssid;
    var jobid;
    var spares;
    var estimates;
    var billamount;
    var discount;
  
    
    userid = req.parse_url.query.userid;
    jobid = req.parse_url.query.jobid;
    ssid = req.parse_url.query.ssid;
    spares = req.parse_url.query.spares;
    estimates = req.parse_url.query.estimates;
    billamount = req.parse_url.query.amount;
    discount = req.parse_url.query.discount;

  
    
    if (ssid == undefined || jobid ==undefined) {
        res.end(JSON.stringify({ error: "Please enter SSid & Jobid" }) + "\n");
        return;
    }
    
    
    var str = '';
    str = "call updateBilling('" +userid + "','" + jobid + "','" + ssid + "','" + spares + "','" + estimates + "','" + billamount + "','" + discount + "')";
   console.log(str);
    conLocalPool.getConnection(function (err, con) {
        
        if (err) {
            if (con)
                con.release();
            console.log('Error while performing Query.(gps_save_pool) handle_updateBill' + err);
            res.end(JSON.stringify({ error: "Error while performing Query.(gps_save_pool) handle_updateBill" + err }) + "\n");
            log.logData('updateBilling', 'FAILURE',err);
            return;
        }
        
        con.query(str, function (err, rows, fields) {
            if (err) {
                console.log('Error while performing Query.(gps_save_con) handle_updateBill' + err);
                res.end(JSON.stringify({ error: "Error while performing Query.(gps_save_con) handle_updateBill" + err }) + "\n");
                log.logData('updateBilling', 'FAILURE', err);
            }
            else {
                
                res.end(JSON.stringify({ status: rows[0]}) + "\n");
                log.logData('updateBilling', 'SUCCESS', '');
            }
            con.release();
          
        });


    });

}

function handle_setSummary(req, res) {

    req.parse_url = url.parse(req.url, true);
    var coreurl = req.parse_url.pathname;

    res.writeHead(200, { "Content-Type" : "application/json" });
    var mysql = db.mysql;
    var conLocalPool = db.conLocalPool;
    
    var ssid;
    var type;
    var switchs;
   
  
    
    ssid = req.parse_url.query.ssid;
    type = req.parse_url.query.type;
    switchs = req.parse_url.query.switch;
      
    
    if (ssid == undefined || type ==undefined || switchs == undefined) {
        res.end(JSON.stringify({ error: "Please enter ssid & Type" }) + "\n");
        return;
    }
    
    
    var str = '';
    str = "call updateSummaryStatus('" +ssid + "','" + type + "','" + switchs + "')";
    console.log(str);
    conLocalPool.getConnection(function (err, con) {
        
        if (err) {
            if (con)
                con.release();
            console.log('Error while performing Query.(gps_save_pool) handle_setSummary' + err);
            res.end(JSON.stringify({ error: "Error while performing Query.(gps_save_pool) handle_setSummary" + err }) + "\n");
            log.logData('updateSummaryStatus', 'FAILURE',err);
            return;
        }
        
        con.query(str, function (err, rows, fields) {
            if (err) {
                console.log('Error while performing Query.(gps_save_con) handle_setSummary' + err);
                res.end(JSON.stringify({ error: "Error while performing Query.(gps_save_con) handle_setSummary" + err }) + "\n");
                log.logData('updateSummaryStatus', 'FAILURE', err);
            }
            else {
                
                res.end(JSON.stringify({ status: rows[0]}) + "\n");
                log.logData('updateSummaryStatus', 'SUCCESS', '');
            }
            con.release();
          
        });


    });

}

function handle_addUsers(req, res) {

    req.parse_url = url.parse(req.url, true);
    var coreurl = req.parse_url.pathname;

    res.writeHead(200, { "Content-Type" : "application/json" });
    var mysql = db.mysql;
    var conLocalPool = db.conLocalPool;
    
    var userName;
    var ssid;
    var phonenumber;
    var roleId;
    
   
    var VerificationCode = Math.floor(Math.random() * (9999 - 1000) + 1000);
    
    userName = req.parse_url.query.username;
    phonenumber = req.parse_url.query.phone;
    roleId = req.parse_url.query.roleid;
    ssid = req.parse_url.query.ssid;
      
    
    if (userName == undefined || phonenumber ==undefined || roleId == undefined) {
        res.end(JSON.stringify({ error: "Please enter Username & Phone & Role" }) + "\n");
        return;
    }
    
    
    var str = '';
    str = "call addStationUser('" +ssid + "','" +userName + "','" + phonenumber + "','" + roleId + "','" + VerificationCode + "')";
    
    conLocalPool.getConnection(function (err, con) {
        
        if (err) {
            if (con)
                con.release();
            console.log('Error while performing Query.(gps_save_pool) handle_addUsers' + err);
            res.end(JSON.stringify({ error: "Error while performing Query.(gps_save_pool) handle_addUsers" + err }) + "\n");
            log.logData('addStationUser', 'FAILURE',err);
            return;
        }
        
        con.query(str, function (err, rows, fields) {
            if (err) {
                console.log('Error while performing Query.(gps_save_con) handle_addUsers' + err);
                res.end(JSON.stringify({ error: "Error while performing Query.(gps_save_con) handle_addUsers" + err }) + "\n");
                log.logData('addStationUser', 'FAILURE', err);
            }
            else {
                
                res.end(JSON.stringify({ status: rows[0]}) + "\n");
                log.logData('addStationUser', 'SUCCESS', '');
            }
            con.release();
          
        });


    });

}


function handle_editUsers(req, res) {

    req.parse_url = url.parse(req.url, true);
    var coreurl = req.parse_url.pathname;

    res.writeHead(200, { "Content-Type" : "application/json" });
    var mysql = db.mysql;
    var conLocalPool = db.conLocalPool;
    
    var userName;
    var userid;
    var phonenumber;
    var roleId;
    
   
    var VerificationCode = Math.floor(Math.random() * (9999 - 1000) + 1000);
    
    userName = req.parse_url.query.username;
    userid = req.parse_url.query.userid;
    phonenumber = req.parse_url.query.phone;
    roleId = req.parse_url.query.roleid;

    
      
    
    if (userName == undefined || phonenumber ==undefined || roleId == undefined || userid == undefined) {
        res.end(JSON.stringify({ error: "Please enter Username & Phone & Role & Userid" }) + "\n");
        return;
    }
    
    
    var str = '';
    str = "call editStationUser('" +userid + "','" +userName + "','" + phonenumber + "','" + roleId + "','" + VerificationCode + "')";
    
    conLocalPool.getConnection(function (err, con) {
        
        if (err) {
            if (con)
                con.release();
            console.log('Error while performing Query.(gps_save_pool) handle_editUsers' + err);
            res.end(JSON.stringify({ error: "Error while performing Query.(gps_save_pool) handle_editUsers" + err }) + "\n");
            log.logData('editStationUser', 'FAILURE',err);
            return;
        }
        
        con.query(str, function (err, rows, fields) {
            if (err) {
                console.log('Error while performing Query.(gps_save_con) handle_editUsers' + err);
                res.end(JSON.stringify({ error: "Error while performing Query.(gps_save_con) handle_editUsers" + err }) + "\n");
                log.logData('editStationUser', 'FAILURE', err);
            }
            else {
                
                res.end(JSON.stringify({ status: rows[0]}) + "\n");
                log.logData('editStationUser', 'SUCCESS', '');
            }
            con.release();
          
        });


    });

}

function handle_getallRoles(req, res) {

    req.parse_url = url.parse(req.url, true);
    var coreurl = req.parse_url.pathname;

    res.writeHead(200, { "Content-Type" : "application/json" });
    var mysql = db.mysql;
    var conLocalPool = db.conLocalPool;
    
    var ssid;
       
    ssid = req.parse_url.query.ssid;
      
    
    if (ssid == undefined) {
       ssid = '';
    }
    
    
    var str = '';
    str = "call getallRoles('" +ssid + "')";
    
    conLocalPool.getConnection(function (err, con) {
        
        if (err) {
            if (con)
                con.release();
            console.log('Error while performing Query.(gps_save_pool) handle_getallRoles' + err);
            res.end(JSON.stringify({ error: "Error while performing Query.(gps_save_pool) handle_getallRoles" + err }) + "\n");
            log.logData('getallRoles', 'FAILURE',err);
            return;
        }
        
        con.query(str, function (err, rows, fields) {
            if (err) {
                    console.log('Error while performing Query.(gps_save_con) handle_getallRoles' + err);
                res.end(JSON.stringify({ error: "Error while performing Query.(gps_save_con) handle_getallRoles" + err }) + "\n");
                log.logData('getallRoles', 'FAILURE', err);
            }
            else {
                
                res.end(JSON.stringify({ status: rows[0]}) + "\n");
                log.logData('getallRoles', 'SUCCESS', '');
            }
            con.release();
          
        });


    });

}

function handle_getallRemindersInfo(req, res) {

    req.parse_url = url.parse(req.url, true);
    var coreurl = req.parse_url.pathname;

    res.writeHead(200, { "Content-Type" : "application/json" });
    var mysql = db.mysql;
    var conLocalPool = db.conLocalPool;
    
    var ssid;
       
    ssid = req.parse_url.query.ssid;
      
    
    if (ssid == undefined) {
       res.end(JSON.stringify({ error: "Please enter SSID" }) + "\n");
        return;
    }
    
    
    var str = '';
    str = "call getRemindersInfo('" +ssid + "')";
    
    conLocalPool.getConnection(function (err, con) {
        
        if (err) {
            if (con)
                con.release();
            console.log('Error while performing Query.(gps_save_pool) handle_getallRemindersInfo' + err);
            res.end(JSON.stringify({ error: "Error while performing Query.(gps_save_pool) handle_getallRemindersInfo" + err }) + "\n");
            log.logData('getRemindersInfo', 'FAILURE',err);
            return;
        }
        
        con.query(str, function (err, rows, fields) {
            if (err) {
                    console.log('Error while performing Query.(gps_save_con) handle_getallRemindersInfo' + err);
                res.end(JSON.stringify({ error: "Error while performing Query.(gps_save_con) handle_getallRemindersInfo" + err }) + "\n");
                log.logData('getRemindersInfo', 'FAILURE', err);
            }
            else {
                
                res.end(JSON.stringify({ Reminders: rows[0]}) + "\n");
                log.logData('getRemindersInfo', 'SUCCESS', '');
            }
            con.release();
          
        });


    });

}

function handle_billStatus(req, res) {

    req.parse_url = url.parse(req.url, true);
    var coreurl = req.parse_url.pathname;

    res.writeHead(200, { "Content-Type" : "application/json" });
    var mysql = db.mysql;
    var conLocalPool = db.conLocalPool;
    
    var ssid;
    var jobid;
       
    ssid = req.parse_url.query.ssid;
    jobid = req.parse_url.query.jobid;
      
    
    if (ssid == undefined && jobid == undefined) {
       ssid = '';
    }
    
    
    var str = '';
    str = "call getPrintBillStatus('" +ssid + "','" +jobid+ "')";
    
    conLocalPool.getConnection(function (err, con) {
        
        if (err) {
            if (con)
                con.release();
            console.log('Error while performing Query.(gps_save_pool) handle_billStatus' + err);
            res.end(JSON.stringify({ error: "Error while performing Query.(gps_save_pool) handle_billStatus" + err }) + "\n");
            log.logData('getPrintBillStatus', 'FAILURE',err);
            return;
        }
        
        con.query(str, function (err, rows, fields) {
            if (err) {
                    console.log('Error while performing Query.(gps_save_con) handle_billStatus' + err);
                res.end(JSON.stringify({ error: "Error while performing Query.(gps_save_con) handle_billStatus" + err }) + "\n");
                log.logData('getPrintBillStatus', 'FAILURE', err);
            }
            else {
                
                res.end(JSON.stringify({ PrintStatus: rows[0],BillingStatus: rows[1]}) + "\n");
                log.logData('getPrintBillStatus', 'SUCCESS', '');
            }
            con.release();
          
        });


    });

}

function handle_uploadPhoto(req, res) {

    req.parse_url = url.parse(req.url, true);
    var coreurl = req.parse_url.pathname;

    res.writeHead(200, { "Content-Type" : "application/json" });
    var mysql = db.mysql;
    var conLocalPool = db.conLocalPool;
    
    var ssid;
    var uid;
    var photo;
    
    uid = req.parse_url.query.userid;   
    ssid = req.parse_url.query.ssid;
    photo = req.parse_url.query.imagename;
      
    
    if (ssid == undefined && uid == undefined && photo == undefined) {
       
        res.end(JSON.stringify({ error: "Please enter SSID & Userid & Photo" }) + "\n");
        return;
    }
    
    
    var str = '';
    str = "call uploadPhoto('" +uid + "','" +ssid + "','" +photo+ "')";
    
    conLocalPool.getConnection(function (err, con) {
        
        if (err) {
            if (con)
                con.release();
            console.log('Error while performing Query.(gps_save_pool) handle_uploadPhoto' + err);
            res.end(JSON.stringify({ error: "Error while performing Query.(gps_save_pool) handle_uploadPhoto" + err }) + "\n");
            log.logData('uploadPhoto', 'FAILURE',err);
            return;
        }
        
        con.query(str, function (err, rows, fields) {
            if (err) {
                    console.log('Error while performing Query.(gps_save_con) handle_uploadPhoto' + err);
                res.end(JSON.stringify({ error: "Error while performing Query.(gps_save_con) handle_uploadPhoto" + err }) + "\n");
                log.logData('uploadPhoto', 'FAILURE', err);
            }
            else {
                
                res.end(JSON.stringify({ status: rows[0]}) + "\n");
                log.logData('uploadPhoto', 'SUCCESS', '');
            }
            con.release();
          
        });


    });

}

var s = http.createServer(handle_income_request);
s.listen(8888);