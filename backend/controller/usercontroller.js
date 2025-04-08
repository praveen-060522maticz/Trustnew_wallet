import config from "../config/config";
import User from "../models/User.schema"

import CMS from "../models/cms.schema"
import dappcat from '../models/dappcat.schema'
import dappsdata from '../models/dapp.schema'
import { Encryptdata, isEmpty } from "../commenfunction/commenfunction";
import jwt from "jsonwebtoken";

import notificationSchema from "../models/notification.schema";
import { fcmNotification } from "../commenfunction/fcmmessage";
jwt.sign(
  {
    _id: "611f4f5e9d55672c7c59bd1b",
  },

  config.secretOrKey,
  (err, data) => {
    // console.log("-----data", data);
  }
);

//sign in module----start


/*
Method:post
Url:/getcmsdata
Params:content,},
 ------ serachfuctions --------
*/
//
export const GetCMSdata = async (req, res) => {
  try {
    var CMSdata = await CMS.findOne({ question: req.body.content })
    if (CMSdata) {
      return res.status(200).json(Encryptdata({ "status": true, "msg": "Successfully Done", "data": CMSdata }))

    }
    else {
      return res.status(200).json(Encryptdata({ "status": false, "msg": "data not found" }))

    }

  }
  catch (error) {
    console.log("error", error);
    return res.status(200).json(Encryptdata({ "status": false, "msg": "Error on server", "error": error }))

  }
};

/*
Method:post
Url:/dappcategory
Params:"",
 ------ Dappcategory list--------
*/
//
export const dappcategory = async (req, res) => {


  try {
    // console.log('dappcategory')
    var dappcatdata = await dappcat.find({});
    
    if (dappcatdata) {
      return res.json(Encryptdata({ status: true, data: dappcatdata }));
    }
  } catch (err) {
    console.log('Dapp_category_Err',err)
    return res.json(Encryptdata({ status: false, errors: { messages: "Error on server" } }));
  }
};


/*
Method:post
Url:/dapps
Params:"",
 ------ Dapps list--------
*/
//
export const dapps = async (req, res) => {


  try {
    var dappdata = await dappsdata.find({});
    console.log("dappdatadappdata",dappdata);
    if (dappdata) {
      return res.json((Encryptdata({ status: true, data: dappdata })));
    }
  } catch (err) {
    console.error('dapps_err',err)
    return res.json(Encryptdata({ status: false, errors: { messages: "Error on server" } }));
  }
};

/*
Method:post
Url:/userdata
Params:"",
 ------ User Details list--------
*/
//

export const userdata = async (req, res) => {


  try {
    var userdata = await User.findOne({ Email: req?.body?.email });
    console.log("user finded",userdata);
    if (userdata) {
      return res.json(Encryptdata({ status: true, data: userdata }));
    }
  } catch (err) {
    console.log('userdata_err',err)
    return res.json(Encryptdata({ status: false, errors: { messages: "Error on server" } }));
  }
};



/*
Method:post
Url:/notification
Params:{Evmwalletaddress,Tronwalletaddress,Btcwalletaddress,wallettype,devicetoken},
 ------ User Details list--------
*/
//

export const Notification = async (req, res) => {
  try {
if(req.body.Evmwalletaddress){
  var isExist = await notificationSchema.findOne({ Evmwalletaddress: req.body.Evmwalletaddress });

}
else if(req.body.Tronwalletaddress){
  var isExist = await notificationSchema.findOne({ Evmwalletaddress: req.body.Tronwalletaddress });
}
else if(req.body.Btcwalletaddress){
  var isExist = await notificationSchema.findOne({ Evmwalletaddress: req.body.Btcwalletaddress });

}

      if (isExist != undefined && isExist != null && isExist != "") {
        const updateToken = await notificationSchema.findOneAndUpdate({ Evmwalletaddress: req.body.Evmwalletaddress }, { $push: { devicetoken: req.body.token } }, { new: true });
          if (updateToken) {
              res.json({ status: true, message: "Token updated successfully", result: updateToken })
          } else {
              res.json({ status: false, message: "Token updated Error", result: {} })
          }
      } else {
          const savetoken = new notificationSchema({
              Evmwalletaddress: req.body.Evmwalletaddress,
              Tronwalletaddress:req.body.Tronwalletaddress,
              Btcwalletaddress:req.body.Btcwalletaddress,
              devicetoken: req.body.token,
              wallettype: req.body.wallettype
          })
          const savedata = await savetoken.save();
          if (savedata) {
              res.json(Encryptdata({ status: true, message: "Token Saved Successfully", result: savedata }))
          } else {
              res.json(Encryptdata({ status: false, message: "Token Saved Error", result: {} }))
          }
      }
    

  } catch (e) {
      console.log("notificationSchema_err", e);
      res.json(Encryptdata({ status: false, message: "Token Saved Error", result: {} }))
  }
}

/*
Method:post
Url:/notification
Params:{Receiveraddress,Amount,Symbol},
 ------ User Details list--------
*/
//
export const ReceiveNotification = async (req, res) => {
  try {
      let Address =req.body.Receiveraddress?.toLocaleLowerCase()

      if(req.body.Type=='TRC20'){
        var usersData = await notificationSchema.findOne({Tronwalletaddress:Address})
      }
      else if(req.body.Type=='ERC20'||req.body.Type=='BEP20'){
        var usersData = await notificationSchema.findOne({Evmwalletaddress:Address})
      }
      else if(req.body.Type=='BTC'){
        var usersData = await notificationSchema.findOne({Btcwalletaddress:Address})
      }
      if (!isEmpty(usersData)) {
       
        usersData?.devicetoken.map((item)=>{
                    
          var datas = {
              'to': item,
              'type': "receive",
              'data': {
                  'walletaddress': Address,
                  'devicetoken': item,
                  'amount': req.body.Amount,
                  'symbol': req.body.Symbol
              }

          } 
          if(usersData.notification == true){

              fcmNotification({
                  datas
              }) 
          } 
      })

 

      res.json(Encryptdata({ status: true, message: "Notification Send Successfully", data: usersData }))

      } else {
          return { success: false, data: {} };
      }
  } catch (err) {

      console.log(err, "checkAddress__err")
      return { success: false, data: {} };
  }
}