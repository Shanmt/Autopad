exports.mysqli = function(data,row)
{
     k = mysqli[row];

     for(var i in data)
     {

         k = k.replace(new RegExp('{{'+i+'}}', 'g'), data[i]);


     }
    
     return k;
}


var mysqli = [];
mysqli['getremainder'] = "SELECT cr.*,cust.customername,cust.contact as customerphone,cust.ssid as stationid,sms.*,sd.*,cv.registrationid FROM customer_reminders cr inner join customer cust on cr.customerid = cust.customerid inner join servicestationdetails sd on sd.servicestationid = cust.ssid inner join smsmain sms on sms.servicestationid = cust.ssid inner join customer_vehicle cv on cv.vehicleid = cr.vehicleid  where reminderdate = CURDATE()";
mysqli['insertsmslog'] = "INSERT INTO smslog (smslog, SMScount, servicestationid, createddate, tomobile, customerid) VALUES (?, ?, ?, ?, ?, ?)";
mysqli['insertsmslogcall'] = "call logSMS(?, ?, ?, ?, ?)";
mysqli['get_customer'] = "select * from customer limit 5";
mysqli['get_smscount'] = "SELECT * FROM smsmain where servicestationid = ?";
mysqli['update_smscount'] = "UPDATE smsmain SET SMSused = ? WHERE servicestationid= ?";
mysqli['update_remainders'] = "UPDATE customer_reminders SET reminded = ?,reminded_date = ? WHERE reminderid = ?";
