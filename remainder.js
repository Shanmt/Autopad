var remainders = require('./module/remainder');
var mysqli = require('./module/mysqli');
var q = require('q');
var request = require('request');
var dateformat = require('dateformat');
var db = require('./db_connect.js');




//Function to send Daily Reminders


exports.handle_getallRemainders = function (req, res) {
	var mysql = db.mysql;
    var conLocalPool = db.conLocalPool;

	conLocalPool.getConnection(function (err, con) {
        if (err) {
            if (con)
                con.release();
            console.log('Error while performing Query.(gps_save_pool)' + err);
            return;
        }
        datein_format = 4;
	    dateitem =  new Date().strtotime("+"+datein_format+" day").format('dddd');
	    if(dateitem != 'Sunday'){
		    
		    //Listing & sending SMS 6 Days before the reminder date to Customer
		    q.all([remainders.getremainders(req, global.connect, q,datein_format,dateitem)]).then(function (results) {
		    	rows = results[0][0][0];
			   	var message = '';
			
				for(var i = 0;i < rows.length; i++){

					sscontact = rows[i].contactnumber;
					cust_name= rows[i].customername;
					ssid = rows[i].ssid;
					phone = rows[i].customerphone;
					senderid = rows[i].SenderID;
					customer_id = rows[i].customerid;
					remainderid = rows[i].reminderid;

					//Message to customer
					customer_message = "Dear "+rows[i].customername+", Thank you being an esteemed customer with "+rows[i].servicestation+". Your vehicle service is due. Kindly contact "+rows[i].contactperson+" ( "+rows[i].contactnumber+" ) for booking.";
					//Api URL
					api_url = 'http://mysms.msgclub.net/rest/services/sendSMS/sendGroupSms?AUTH_KEY=ff10fa8b46156b3429369cbe66f3f1c4&message='+customer_message+'&senderId='+senderid+'&routeId=1&mobileNos=9656142052&smsContentType=english';
					//checking SMS Count
					var smscount = parseInt( customer_message.length / 160 ) + 1;
					
					var available_message = rows[i]['creditSMS'] - rows[i]['SMSused'];
					
					var smsused = rows[i]['SMSused'];


					if((available_message - smscount)  > 0){
						//sending SMS to Customer
						smsrequest(api_url,customer_message,ssid,phone,customer_id,smsused,remainderid);
						
					}
					
					
				}
				
				
		    });
		}
	con.release();
	});



};
