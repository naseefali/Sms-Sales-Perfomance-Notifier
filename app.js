var sql = require('mssql');
var db = require('./DB/db');
var nodeMailer = require('nodemailer');
var aws = require('aws-sdk');
global.config = require('./config');

async function getSalesAmount(database)
{
    var strquery = "use "+database+";SELECT Sum(Distinct(fDebit)) As Amt from tblFinTrans where fDocType IN ('SIC','SIR') and  fBrID NOT IN (41) and CONVERT(date, fDate)= CONVERT (date, GETDATE())";
    console.log(strquery);
    var result = await (db.executeQuery(strquery));
    if (result[0] != undefined) {
        console.log(result);
    }
  return (result.recordset[0].Amt);

}

async function getCoName(database){
  var strQuery = "use "+database+";SELECT fCoName FROM tblCompany"
  const result = await (db.executeQuery(strQuery));
  console.log(strQuery);
  if (result[0] != undefined) {
        console.log(result);
    }
    return (result.recordset[0].fCoName);
}


async function SendSalesSMS(mobNo,database){
    aws.config.loadFromPath('config.json');
    var sns = new aws.SNS();
    var sns_arn = "arn:aws:sns:ap-southeast-1:659123420834:nodeSNS";
    const salesAmount = await (getSalesAmount(database));
    const coName = await (getCoName(database));
    var date = Date.now();
    var strMsg = "ClearDesk Research & Solutions --- "+coName+" --- Today's Sales Amount :- "+salesAmount+" .";
    sns.subscribe({
        Protocol: 'sms',
        TopicArn: sns_arn,
        Endpoint: mobNo
    }, function(error, data) {
        if (error) {
            console.log("error when subscribe", error);
        }
        console.log("subscribe data", data);
        var SubscriptionArn = data.SubscriptionArn;
        var params = {
            TargetArn: sns_arn,
            Message: strMsg,
            Subject: 'CD'
        };
        sns.publish(params, function(err_publish, data) {
            if (err_publish) {
                console.log('Error sending a message', err_publish);
            } else {
                console.log('Sent message:', data.MessageId);
            }
            var params = {
                SubscriptionArn: SubscriptionArn
            };


            sns.unsubscribe(params, function(err, data) {
                if (err) {
                    console.log("err when unsubscribe", err);
                }
            });
        });
    });
}

async function sendAll(){
  //FOR HARMONY
SendSalesSMS("+919744282602","HARMONY");//naseef
SendSalesSMS("+966501159991","HARMONY");//noushad
SendSalesSMS("+919947991663","HARMONY");//mujeeb
  
    //FOR RMAX
SendSalesSMS("+919744282602","RMAX"); //Naseef
SendSalesSMS("+966501159991","RMAX"); //Noushad
SendSalesSMS("+966567867826","RMAX"); //aboobacker
SendSalesSMS("+966541677005","RMAX"); //shahid
SendSalesSMS("+966535597861","RMAX"); //rafi
SendSalesSMS("+966508411302","RMAX"); //illyas
  
      //FOR junbiya
SendSalesSMS("+919744282602","HDSA"); //Naseef
SendSalesSMS("+966501159991","HDSA"); //Noushad
SendSalesSMS("+966567867826","HDSA"); //aboobacker
SendSalesSMS("+966541677005","HDSA"); //shahid
SendSalesSMS("+966535597861","HDSA"); //rafi
SendSalesSMS("+966508411302","HDSA"); //illyas
  
}

sendAll();



