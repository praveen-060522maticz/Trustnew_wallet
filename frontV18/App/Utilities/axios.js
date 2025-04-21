import { ApiConstants, currentChainconfig, tron_api_key, tron_rpc_url } from "../api/ApiConstants";
import axios from "axios";
import { AppenData, axiosFunc } from "./commenfuctions";

  export const Notification = async (payload) => {
    try {
      let formdata = AppenData(payload)

      let respData = {
        'method': 'POST',
        'url': `${ApiConstants.BASE_URL}notification`,
        data: formdata[0],
        'headers': {
          'Content-Type': 'multipart/form-data',
      }
      };
      let Resp = await axiosFunc(respData)
      return Resp   
     }
    catch (err) {
      console.log("AddFcmerr", err);
      return {
        error: err.response
      }
    }
  }
  export const DappCategoryList = async () => {
    try {
      let respData ={
        'method': 'get',
        'url': `${ApiConstants.BASE_URL}dappcategory`,
      }

      let Resp = await axiosFunc(respData)
      return Resp 
          }
    catch (err) {
      console.log("DappCategoryList_err", err);
      return {
        error: err.response
      }
    }
  }
  export const Dapps = async () => {
    // let formdata = AppenData({})

    try {
      let respData = {
        'method': 'get',
        'url': `${ApiConstants.BASE_URL}dapps`,

      }
      let Resp = await axiosFunc(respData)
      return Resp 

    }
    catch (err) {
      console.log("DappCategory_err", err);
      return {
        error: err.response
      }
    }
  }
  export const Cmsdata = async (payload) => {
    try {
      let formdata = AppenData(payload)

      let respData = {
        'method': 'POST',
        'url': `${ApiConstants.BASE_URL}getcmsdata`,
        data: formdata[0],
        'headers': {
          'Content-Type': 'multipart/form-data',
      }
      }

      let Resp = await axiosFunc(respData)
      return Resp 
        }
    catch (err) {
      console.log("Cmsdata_err", err);
      return {
        error: err.response
      }
    }
  }
  export const Gas_estimate = async (payload) => {
    try {
      const rpc = currentChainconfig.TRX.rpc
      let respData = await axios({
        'method': 'POST',
        'url': `${rpc}/wallet/estimateenergy`,
        data: payload,
      });

      return respData.data
    }
    catch (err) {
      console.log("Gas_estimateGas_estimate_err", err);
      return {
        error: err.response
      }
    }
  }
  export const Tron_GeBalance = async (payload) => {
    try {
      const rpc = currentChainconfig.TRX.rpc
      let respData = await axios({
        'method': 'POST',
        'url': `${rpc}/jsonrpc`,
        data: payload,
      });

      return respData.data
    }
    catch (err) {
      console.log("Tron_GeBalanceTron_GeBalanceerr", err);
      return {
        error: err.response
      }
    }
  }
  export const CreateTransaction_Tron = async (payload) => {
    try {
      const rpc = currentChainconfig.TRX.rpc
      let respData = await axios({
        'method': 'POST',
        'url': `${rpc}/wallet/createtransaction`,
        'headers':{
          'Content-Type':'application/json',
          'TRON-PRO-API-KEY':tron_api_key
        },
        data: payload,
      });

      return respData.data
    }
    catch (err) {
      console.log("CreateTransaction_Tron_err", err);
      return {
        error: err.response
      }
    }
  }
  export const Receive_Notification = async (payload) => {
    try {
      let formdata = AppenData(payload)

      let respData = {
        'method': 'POST',
        'url': `${ApiConstants.BASE_URL}receivenotification`,
         data: formdata[0],
         'headers': {
           'Content-Type': 'multipart/form-data',
       }
      }
      let Resp = await axiosFunc(respData)


      return Resp
    }
    catch (err) {
      console.log("Receive_NotificationReceive_Notification_err", err);
      return {
        error: err.response
      }
    }
  }
  export const Gasfees_estimation = async (payload) => {
    try {
      let respData = await axios({
        'method': 'POST',
        'url': `${tron_rpc_url}/wallet/createtransaction`,
        'headers':{
          'Content-Type':'application/json',
          'TRON-PRO-API-KEY':tron_api_key
        },
        data: payload,
      });

      return respData.data
    }
    catch (err) {
      console.log("CreateTransaction_Tron_err", err);
      return {
        error: err.response
      }
    }
  }
  