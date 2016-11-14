var express = require('express');
var remainders = require('../module/remainder');
var mysqli = require('../module/mysqli');
var q = require('q');
var request = require('request');
var dateformat = require('dateformat');
var qs = require('querystring')
var app = express();

var CronJob = require('cron').CronJob;
new CronJob('0 */10 * * * 1-6', function() {
    //console.log('You will see this message every second');

    request({
        rejectUnauthorized: false,
        url:global.url+'remainder/all'
    }, function(error, response, body) {
    	
        if (!error && response.statusCode == 200) {
            console.log('Successfull daily cron');
            // console.log(body) // Show the HTML for the Google homepage.
        }
        else{

            console.log('Failed daily cron');
            console.log(error);
        }
    })
}, null, true, "America/Los_Angeles");


app.get('/list_remainders', function (req, res) {

  	res.sendfile('./templates/test.html');
});
//Function to send Daily Reminders
app.get('/all', function (req, res) {
    
    //query to get all remainders list
    
    
    q.all([remainders.getdata(req, global.connect, q)]).then(function (results) {
    	rows = results[0][0];
	    console.log(rows);
		var message = '';
		var stationlist = [];
		for(var i = 0;i < rows.length; i++){
			sscontact = rows[i].contactnumber;
			cust_name= rows[i].customername;
			ssid = rows[i].ssid;
			phone = rows[i].customerphone;
			senderid = rows[i].SenderID;
			customer_id = rows[i].customerid;
			remainderid = rows[i].reminderid;

			if(stationlist.indexOf(ssid) == -1){
				
				stationlist.push( ssid );
			}

			//Message to customer 9895554438
			customer_message = "Dear "+rows[i].customername+", Thank you being an esteemed customer with "+rows[i].servicestation+". Your vehicle service is due for service. Kindly contact "+rows[i].contactperson+" ( "+rows[i].contactnumber+" ) for booking.";
			//Api URL
			api_url = 'http://mysms.msgclub.net/rest/services/sendSMS/sendGroupSms?AUTH_KEY=ff10fa8b46156b3429369cbe66f3f1c4&message='+customer_message+'&senderId='+senderid+'&routeId=1&mobileNos=9656142052&smsContentType=english';
			//checking SMS Count
			var smscount = parseInt( customer_message.length / 160 ) + 1;
			
			var available_message = rows[i]['creditSMS'] - rows[i]['SMSused'];
			
			var smsused = rows[i]['SMSused'];
			if((available_message - smscount)  > 0){
				//sending SMS to Customer
				smsrequest(api_url,customer_message,ssid,phone,customer_id,smsused,remainderid);

				//Sending SMS To station
				
			}
			
			
		}
		var stationnumbers = stationlist.length;

		for(var st = 0;st< stationnumbers;st++){
					var stationnumber;
					var stationname;
					var current_sms_stats;
					var sendersid;
					

					var seller_msg = "( ";
					for(var k = 0;k < rows.length; k++){
						if(rows[k].ssid == stationlist[st]){
							stationnumber = rows[k].contactnumber;
							stationname = rows[k].servicestation;
							remainderdate = rows[k].reminderdate;
							current_sms_stats = rows[k]['creditSMS'] - rows[k]['SMSused'];
							senderid = rows[k].SenderID;
							seller_msg +="["+ rows[k].customername+" -- "+rows[k].registrationid+' -- '+rows[k].customerphone+"]";
							
						}

					}
					seller_msg +=" )";
					
			        remainderdate = dateformat(remainderdate, "dd-mm-yyyy");
					var sell_message_start = "Dear "+stationname+ ",Following are your customers who has received Service reminder SMS on "+remainderdate+" .";
					seller_msg = sell_message_start+seller_msg;
					var sellersmscount = parseInt( seller_msg.length/ 160 ) + 1 ;
					api_url_st = 'http://mysms.msgclub.net/rest/services/sendSMS/sendGroupSms?AUTH_KEY=ff10fa8b46156b3429369cbe66f3f1c4&message='+seller_msg+'&senderId='+senderid+'&routeId=1&mobileNos=9656142052&smsContentType=english';
					
					if((current_sms_stats - sellersmscount)  > 0){
						smsrequest(api_url_st,seller_msg,stationlist[st],stationnumber,"ServiceStation",sellersmscount,0);
					}
					
		}
		
		
		
		
    });
    //function to Send SMS

    function smsrequest(api_url,customer_message,ssid,phone,customer_id,smsused,remainderid){
    	var message = '';
    	
    	request( api_url  ,function (error, response, body) {
				
				
			    if (!error && response.statusCode == 200) {
			    	
			    	
			    	if( body.indexOf("3001") > 0){
			        	$mysqli2 = {};
			        	var smslog = customer_message;
			        	var smscount = parseInt( smslog.length/160 ) + 1;
			        	
			        	//Adding current SMS count with SMS Length
			        	var sms_used = smsused + smscount;
			        	var servicestation = ssid;
			        	var nows = new Date();
			        	var createddate = dateformat(nows, "yyyy-mm-dd hh:mm:ss");
			        	var tomobile = phone;
			        	var customerid = customer_id;
			        	// Adding Urgument to Update SMSLOG Table
			        	remainders.insertsmslogcall(req, global.connect, q,smslog,smscount,ssid,phone,customerid );

			        	//Update SMS Count
			        	q.all([remainders.getsmscount(req, global.connect, q,ssid,smscount)]).then(function (smsdata) {
			        		
			        		var updatesmsvalue = parseInt(smsdata[0][0][0]['creditSMS'] - smsdata[0][0][0]['SMSused']+smscount);
			        		
							remainders.updatesms(req, global.connect, q,ssid,updatesmsvalue );
							
						});
						if(remainderid > 0){
							remainders.update_remainders(req, global.connect, q,remainderid,createddate );
						}		        	
			        				        				        	
			   		}
			        else{
			        	console.log('failure');	
			        }

			    }

			});
    }

    res.end();
    return false;
});

/*app.get('/test', function (req, res) {

	smslog="Shan";
	smscount = 2;
	ssid = "df9f87f6-f7e4-11e5-b87d-000d3a111a7";
	phone="9656142052";
	customerid = "ServiceStation";
	remainders.insertsmslogcall(req, global.connect, q,smslog,smscount,ssid,phone,customerid );
	res.end();
});*/


module.exports = app;