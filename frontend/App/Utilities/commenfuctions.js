import { View, Text, Image } from "react-native";
import { Fonts } from "./fonts";
import Axios from "axios";
import Web3 from 'web3';
import { ApiConstants, currentChainconfig, secretOrKey } from "../api/ApiConstants";
import CryptoJS, { AES, enc } from 'crypto-js';
import Tron from "../Assets/caexicons/tron.svg"
import Eth1 from "../Assets/caexicons/eth1.svg"
import Bnc1 from "../Assets/caexicons/bnc1.svg"
import Btc from "../Assets/caexicons/btc.svg"

import { deviceheight, devicewidth } from "../Utilities/Dimensions";
import { useContext, useEffect, useRef, useState } from "react";
import themeContext from "../Utilities/themecontext";
import axios from "axios";
import noImage from '../Assets/Images/no-image_lm.png'





const web3 = new Web3();


export const isEmpty = value =>
  value === undefined ||
  value === null ||
  // isNaN(value) ||
  (typeof value === 'object' && Object.keys(value).length === 0) ||
  (typeof value === 'string' && value.trim().length === 0) ||
  (typeof value === 'string' && value === '0') ||
  (typeof value === 'number' && value === 0);


export const convert = (timestamp) => {

  if (timestamp.toString().length == 13) {
    var milliseconds = timestamp;
  } else {
    var milliseconds = timestamp * 1000;
  }


  const humanDateFormat = timeformat(milliseconds);
  return (
    <View style={{ marginHorizontal: 30 }}>
      <Text
        style={{
          fontFamily: Fonts.Regular,
          fontSize: 14,
          color: "grey",
        }}
      >
        {humanDateFormat}
      </Text>
    </View>
  );
};


export const timeformat = (data) =>
  `${new Date(data).getDate()}-${new Date(data).getMonth() + 1}-${new Date(data).getFullYear()} ${new Date(data).getHours()}:${new Date(data).getMinutes()} `


//For AddressShow
export const addressshowing = (data) => {
  if (data?.length > 10) {
    var address = data?.substring(0, 10) + '...' + data?.substring(data.length - 11, data.length - 1)
  } else {
    var address = data
  }
  return address

}




export const convertamount = (n) => {
  try {
    // var sign = +n < 0 ? "-" : "",
    var toStr = n.toString();
    if (!/e/i.test(toStr)) {
      return n;
    }
    var [lead, decimal, pow] = n
      .toString()
      .replace(/^-/, "")
      .replace(/^([0-9]+)(e.*)/, "$1.$2")
      .split(/e|\./);
    return +pow < 0 ?
      //  sign +
      "0." +
      "0".repeat(Math.max(Math.abs(pow) - 1 || 0, 0)) +
      lead +
      decimal
      :
      // sign +
      lead +
      (+pow >= decimal.length
        ? decimal + "0".repeat(Math.max(+pow - decimal.length || 0, 0))
        : decimal.slice(0, +pow) + "." + decimal.slice(+pow));
  } catch (err) {
    console.error("convertamount_err", err)
    return 0;
  }
}



export function convertHexToNumber(value) {
  try {
    if (web3.utils.isHex(value)) {
      return web3.utils.hexToNumber(value);
    }

    return value;
  }
  catch (e) {
    console.error("convertHexToNumber_err", e)
    return web3.utils.hexToNumberString(value);

  }
}

export const fiatcurrencies = async (currenciesdata, Fiatcurrencie) => {
  try {
    var currencies = currenciesdata
    let fiatcurrencies = Fiatcurrencie;
    var Fiat = await Promise.all(currencies.map(async (item) => {
      var symbol = item;
      var fiatsymbol = fiatcurrencies;

      let respData = await Axios({
        method: "get",
        url: `https://min-api.cryptocompare.com/data/price?fsym=${symbol}&tsyms=${fiatsymbol}`,

      });
      return respData.data



    }))
    return Fiat



  } catch (err) {
    console.error("coin markt cap coin", err);
  }

}
export function toExpo(x) {

  if (x) {

    x = convert(x)

    if (x?.toString()?.includes("0.00000000")) { return x }
    if (x?.toString()?.includes("0.") && x?.toString()?.split(".")[1]?.length > 3) { return parseFloat(x).toFixed(5) }
    else {
      const lookup = [
        { v: 1E3, s: "K" },
        { v: 1E6, s: "M" },
        { v: 1E9, s: "B" },
        { v: 1E12, s: "T" },
        { v: 1E15, s: "P" },
        { v: 1E18, s: "E" },
        { v: 1E21, s: "Z" },
        { v: 1E24, s: "Y" }
      ],
        digits = 3
      const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
      var item = lookup.slice().reverse().find(function (item) {
        return x >= item.v;
      });
      return !isEmpty(x) ? item
        ? Number(String(((x / item.v).toFixed(digits)).replace(rx, "$1"))).toLocaleString() + item.s
        : x?.toString()?.split('0.')[0] == ""
          ? x
          : parseFloat(x).toLocaleString()
        : 0
    }

  }
  else return 0


}
export const MinuteHourFormat = (data) => {
  return ((Number(isEmpty(data) ? 0 : data) < 10 ? '0' : '') + data)
}
//Date Time Format to Show
export const DateTimeForm = (date, datealone, timealone, ampm) => {
  try {
    if (datealone) {
      return `${MinuteHourFormat(new Date(date)?.getDate())}/${MinuteHourFormat(new Date(date)?.getMonth() + 1)}/${MinuteHourFormat(new Date(date)?.getFullYear())}`
    }
    else if (timealone) {
      if (ampm) {
        return `${MinuteHourFormat(new Date(date)?.getHours() > 12 ? new Date(date)?.getHours() - 12 : new Date(date)?.getHours())}:${MinuteHourFormat(new Date(date)?.getMinutes())} ${new Date(date)?.getHours() >= 12 ? 'p.m' : 'a.m'}`
      }
      else {
        return `${MinuteHourFormat(new Date(date)?.getHours())}:${MinuteHourFormat(new Date(date)?.getMinutes())} `
      }
    }
    else if (ampm) {
      return `${MinuteHourFormat(new Date(date)?.getDate())}/${MinuteHourFormat(new Date(date)?.getMonth() + 1)}/${MinuteHourFormat(new Date(date)?.getFullYear())}, ${MinuteHourFormat(new Date(date)?.getHours() > 12 ? new Date(date)?.getHours() - 12 : new Date(date)?.getHours())}:${new Date(date)?.getMinutes()} ${new Date(date)?.getHours() >= 12 ? 'p.m' : 'a.m'} `
    }
    return `${new Date(date)?.getDate()}:${new Date(date)?.getMonth() + 1}:${new Date(date)?.getFullYear()},${new Date(date)?.getHours()}:${new Date(date)?.getMinutes()} `
  }
  catch (err) {
    return "No Date"
  }
}
//Privatekey Decrypt
export const DecryptPrivateKey = (key, type) => {
  try {
    var bytes = AES.decrypt(key, ApiConstants.secretOrKey);
    var privatekey = bytes.toString(enc.Utf8)

    if (!isEmpty(type)) {
      if (type == 'BTC' || type == 'TRC') {
        var data = (privatekey).replace('0x', "")
        return data

      }
      else {
        return privatekey

      }
    }
    else {
      if (privatekey.includes("0x")) {
        return privatekey
      }
      else {
        var data = `0x${privatekey}`
        return data
      }
    }
  } catch (error) {
    console.log("errer on DecryptPrivateKey", error);
  }

};
//Privatekey Encrypt
export const EnCryptPrivateKey = (data) => {
  // console.log("ApiConstants.secretOrKeyApiConstants.secretOrKey", ApiConstants);
  return AES.encrypt(data, ApiConstants.secretOrKey).toString()
}


export function etoFixed(x) {
  if (Math.abs(x) < 1.0) {
    var e = parseInt(x.toString().split('e-')[1]);
    if (e) {
      x *= Math.pow(10, e - 1);
      x = '0.' + (new Array(e)).join('0') + x.toString().substring(2);
    }
  } else {
    var e = parseInt(x.toString().split('+')[1]);
    if (e > 20) {
      e -= 20;
      x /= Math.pow(10, e);
      x += (new Array(e + 1)).join('0');
    }
  }
  return x;
}


export function getSignParamsMessage(params) {

  try {
    const message = params.filter((p) => !web3.utils.isAddress(p))[0];
    return convertHexToUtf8(message);
  } catch (error) {
    console.log("errror on getSignParamsMessage", error);
  }

}

//Convert Het to number
export function convertHexToUtf8(value) {
  try {
    if (web3.utils.isHex(value)) {
      return web3.utils.hexToUtf8(value);
    }

    return value;
  } catch (error) {
    console.log("erroor ", error);
  }

}
//Showing Icon Function
export const showImage = (item, width, height) => {
  const theme = useContext(themeContext);
  console.log('eughiusegeiusgiuseguiesu---->',item, width, height);
  if (theme.theme == 'dark') {
    if (item == "ERC20" || item.includes("ETH")) {
      return <Eth1 width={devicewidth * width} height={deviceheight * height} />;
    } else if (item == "BEP20" || item.includes("BNB")) {
      return <Bnc1 width={devicewidth * width} height={deviceheight * height} />;
    }
    else if (item == "TRC20" || item.includes("TRX")) {
      return <Tron width={devicewidth * width} height={deviceheight * height} />
    }
    else if (item == "BTC" || item.includes("BTC")) {
      return <Btc width={devicewidth * width} height={deviceheight * height} />
    } else {
      const getCurrency = Object.values(currentChainconfig).find(val => val?.token_type === item);
      console.log('getCurrencygetCurrency---->',getCurrency);
      return getCurrency?.icon || <></>
    }

  }
  else {
    if (item == "ERC20" || item.includes("ETH")) {
      return <Eth1 width={devicewidth * width} height={deviceheight * height} />;
    } else if (item == "BEP20" || item.includes("BNB")) {
      return <Bnc1 width={devicewidth * width} height={deviceheight * height} />;
    }
    else if (item == "TRC20" || item.includes("TRX")) {
      return <Tron width={devicewidth * width} height={deviceheight * height} />
    }
    else if (item == "BTC" || item.includes("BTC")) {
      return <Btc width={devicewidth * width} height={deviceheight * height} />
    } else {
      const getCurrency = Object.values(currentChainconfig).find(val => val?.token_type === item);
      console.log('getCurrencygetCurrency---->',getCurrency);

      return getCurrency?.icon || <></>
    }

  }

};
export const ConsoleLog = (key, data) => {
  return console.log(key, JSON.stringify(data, null, 2));

}

export const Name_showing = (item) => {
  if (item && item.toString().length > 15) {
    var slice_front = item.slice(0, 10);
    var slice_end = item.slice(item.length - 9, item.length - 1)
    return slice_front + "....";
  } else return item;
};

export const AppenData = (data) => {

  var formdata = new FormData()

  var SendDta = Object.entries(data).map((item) => {
    if (Array.isArray(item[1])) {
      var come = item[1].map(data => {
        if (data?.type) {
          formdata.append(item[0], (data))
        }
        else {
          formdata.append(item[0], Encryptdata(data))
        }
        return formdata
      })
      return come
    }
    else {
      if (item?.[1]?.type) {
        formdata.append(item[0], (item[1]))
      }
      else {
        formdata.append(item[0], Encryptdata(item[1]))
      }
      return formdata
    }
  })
  return SendDta
}
export const axiosFunc = (async (data) => {
  try {

    let Resp = await axios(data)
    console.log("RespRespResp", Resp.data);

    if (Resp?.data) {
      Resp.data = Resp.data ? isEmpty(Decryptdata(Resp.data)) ? Resp.data : Decryptdata(Resp.data) : Resp.data
    }
    return Resp.data
  }
  catch (e) {

    return false
  }
})
export const Decryptdata = (data) => {
  try {
    if (isEmpty(data)) {
      return data
    }
    console.log("secretOrKey", ApiConstants.secretOrKey);
    const decData = CryptoJS.enc.Base64.parse(data)?.toString(CryptoJS.enc.Utf8);
    const bytes = AES.decrypt(decData, ApiConstants.secretOrKey).toString(CryptoJS.enc.Utf8);
    return JSON.parse(bytes)
  }
  catch (e) {
    return ''
  }
}
export const Encryptdata = (data) => {
  const encJson = CryptoJS.AES.encrypt(JSON.stringify(data), ApiConstants.secretOrKey).toString();
  const encData = CryptoJS.enc.Base64.stringify(
    CryptoJS.enc.Utf8.parse(encJson)
  );
  return encData;
}


export const getImageUrl = async (imageUrl, siteUrl) => {
  try {
    const splitDomainName = siteUrl.split("/");
    const getDomainName = splitDomainName[2];

    // console.log("Domain Name:", getDomainName,siteUrl);

    const splitdata = siteUrl?.split("")
    const getFavIcon = splitdata[splitdata.length - 1] == "/" ? siteUrl : `${siteUrl}/`

    try {
      await axios.get(imageUrl, { responseType: 'blob' }); // Fetch image as a blob
      return imageUrl;
    } catch (primaryError) {
      try {
        await axios.get(`${getFavIcon}favicon.ico`, { responseType: 'blob' });
        return `${getFavIcon}favicon.ico`;
      } catch (e) {
        try {
          await axios.get(`https://api.faviconkit.com/${getDomainName}/64`, { responseType: 'blob' });
          return `https://api.faviconkit.com/${getDomainName}/64`
        } catch (error) {
          return null
        }
      }
    }
  } catch (e) {
    console.error("Error in getImageUrl:", e);
    return null;
  }
};


export const ImageComponent = ({ icons, url, style }) => {
  const [imageUri, setImageUri] = useState(null);
  const imageRef = useRef()
  const [imageErr, setImageErr] = useState(false);

  useEffect(() => {
    const loadImage = async () => {
      const uri = await getImageUrl(icons, url);
      setImageUri(uri);
    };
    loadImage();
  }, [icons, url]);

  if (!imageUri) {
    return <Image source={noImage} style={style} />;
  }

  const onErrHandle = (e) => {
    setImageErr(true)
  }

  return (
    <Image source={imageErr ? noImage : { uri: imageUri }} ref={imageRef} onError={(e) => onErrHandle(e)} style={style} />
  );
};