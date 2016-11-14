var mysqli = require('./mysqli');
var mysql = require('mysql');
var q = require('q');

exports.getdata = function(req,mysql,q)
{

  $mysqli =  {};
  strQuery = mysqli.mysqli($mysqli,'getremainder');
  var escape_data = [];
  var defered = q.defer();
  query =  mysql.query(strQuery,escape_data,defered.makeNodeResolver());
  console.log(query.sql);
  return defered.promise;
}

exports.insertsmslog = function(req,mysql,q,smslog,smscount,ssid,createddate,phone,customerid )
{

  $mysqli =  {};
  strQuery = mysqli.mysqli($mysqli,'insertsmslog');
  var escape_data = [smslog,smscount,ssid,createddate,phone,customerid];
  var defered = q.defer();
  query =  mysql.query(strQuery,escape_data,defered.makeNodeResolver());
  console.log(query.sql);
  return defered.promise;
}

exports.insertsmslogcall = function(req,mysql,q,smslog,smscount,ssid,phone,customerid )
{

  $mysqli =  {};
  strQuery = mysqli.mysqli($mysqli,'insertsmslogcall');
  var escape_data = [smslog,smscount,ssid,phone,customerid];
  var defered = q.defer();
  query =  mysql.query(strQuery,escape_data,defered.makeNodeResolver());
  console.log(query.sql);
  return defered.promise;
}

exports.getallcustomer = function(req,mysql,q)
{

  $mysqli =  {};
  strQuery = mysqli.mysqli($mysqli,'get_customer');
  var escape_data = [];
  var defered = q.defer();
  query =  mysql.query(strQuery,escape_data,defered.makeNodeResolver());
  console.log(query.sql);
  return defered.promise;

}

exports.getsmscount = function(req,mysql,q,ssid,smscount)
{

  $mysqli =  {};
  strQuery = mysqli.mysqli($mysqli,'get_smscount');
  var escape_data = [ssid];
  var defered = q.defer();
  query =  mysql.query(strQuery,escape_data,defered.makeNodeResolver());
  console.log(query.sql);
  return defered.promise;

}

exports.updatesms = function(req,mysql,q,ssid,smsused)
{

  $mysqli =  {};
  strQuery = mysqli.mysqli($mysqli,'update_smscount');
  var escape_data = [smsused,ssid];
  var defered = q.defer();
  query =  mysql.query(strQuery,escape_data,defered.makeNodeResolver());
  console.log(query.sql);
  return defered.promise;

}

exports.update_remainders = function(req,mysql,q,remainderid,createddate)
{

  $mysqli =  {};
  strQuery = mysqli.mysqli($mysqli,'update_remainders');
  var escape_data = [1,createddate,remainderid];
  var defered = q.defer();
  query =  mysql.query(strQuery,escape_data,defered.makeNodeResolver());
  console.log(query.sql);
  return defered.promise;

}