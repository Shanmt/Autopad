var smsrequest = require("request");
var db = require('./db_connect.js');
var log = require('./log.js');

var http = require('http');
var url = require('url');




exports.SMSData = function (ssid,message,number,customerid, senderid) {
   
    var url = "http://mysms.msgclub.net/rest/services/sendSMS/sendGroupSms?AUTH_KEY=ff10fa8b46156b3429369cbe66f3f1c4&message=[DATA]&senderId=[SENDERID]&routeId=1&mobileNos=[NUMBER]&smsContentType=english";
    
    url = url.replace("[DATA]", message);
    url = url.replace("[NUMBER]", number);
    url = url.replace("[SENDERID]", senderid);

    smsrequest(url, function (err, response, body) {
        if (err) {
            return err;
        }
        else {
            var result = JSON.parse(body);
            if (result.responseCode != "3001") {
                ee.emit('error', new Error(body));
            }
            else {
                
                var mysql = db.mysql;
                var conLocalPool = db.conLocalPool;
               
                var smscount = parseInt( message.length / 160);
                
                if (message.length / 160 > smscount)
                    smscount++;
                
                conLocalPool.getConnection(function (err, con) {
                    if (err) {
                        if (con)
                            con.release();
                        console.log('Error while performing Query. smslog' + err);
                        return;
                    }
                    var str = "call logSMS('" + ssid + "','" + message + "'," + smscount + ",'" + number + "','" + customerid + "')";
                    
                    con.query(str, function (err, rows, fields) {
                        if (err) {
                            console.log('Error while performing Query.smslog'  + err);
                            con.release();
                        }
                        else {
                            con.release();
                           
                        }
          
                    });

                });
            }
        }
    });
};