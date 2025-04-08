import jwt from 'jsonwebtoken'
import config from '../config/config'
import CryptoJS, { AES, enc } from "crypto-js";
import fs from "fs";
export const isEmpty = (value) =>{
    value === undefined ||
    value === null ||
    (typeof value === 'object' && Object.keys(value).length === 0) ||
    (typeof value === 'string' && value.trim().length === 0) ||
    (typeof value === 'string' && value === '0')||
    (typeof value === 'number' && value === 0)||
    (typeof value === 'boolean' && value === false);
    }
    export const verifyToken = async (req, res, next) => {
        const authToken = req.headers['authorization'];
        const token = (authToken && authToken.split(' ')[1]) ?? authToken;
        await jwt.verify(token, config.secretOrKey, (err, user) => {
          if (err) return res.status(200).json({ "Status": false, "msg": "Authentication Failed", success: 'error' })
          else {
            return next();
          }
        })
      
      }

      export const Decryptdata = (data) => {
        try{
        if(isEmpty(data)){
          return data
        }
        const decData = CryptoJS.enc.Base64.parse(data)?.toString(CryptoJS.enc.Utf8);
        const bytes = CryptoJS.AES.decrypt(decData, config.secretOrKey).toString(CryptoJS.enc.Utf8);
        return JSON.parse(bytes)
        }
        catch(e){
          return ''
        }
      }
      export const Encryptdata = (data) => {
        // console.log('config.secretOrKey',config.secretOrKey)
        const encJson = CryptoJS.AES.encrypt(JSON.stringify(data),config.secretOrKey).toString();
        const encData = CryptoJS.enc.Base64.stringify(
          CryptoJS.enc.Utf8.parse(encJson)
        );
        return encData;
      }