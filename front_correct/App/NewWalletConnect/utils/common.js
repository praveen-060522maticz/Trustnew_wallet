import axios from "axios";
import { EIP155_CHAINS, getRequestedChainList } from "./network";
import { useEffect, useState } from "react";
import { Image } from "react-native";

export const EIP155_SIGNING_METHODS = {
  PERSONAL_SIGN: 'personal_sign',
  ETH_SIGN: 'eth_sign',
  ETH_SIGN_TRANSACTION: 'eth_signTransaction',
  ETH_SIGN_TYPED_DATA: 'eth_signTypedData',
  ETH_SIGN_TYPED_DATA_V3: 'eth_signTypedData_v3',
  ETH_SIGN_TYPED_DATA_V4: 'eth_signTypedData_v4',
  ETH_SEND_RAW_TRANSACTION: 'eth_sendRawTransaction',
  ETH_SEND_TRANSACTION: 'eth_sendTransaction',
};

export const TRON_SIGNING_METHODS = {
  TRON_SIGN_TRANSACTION: 'tron_signTransaction',
  TRON_SIGN_MESSAGE: 'tron_signMessage'
};

export const SOLANA_SIGNING_METHODS = {
  SOLANA_SIGN_TRANSACTION: 'solana_signTransaction',
  SOLANA_SIGN_MESSAGE: 'solana_signMessage'
};


export const getRequestedMethods = (data) => {
  switch (data) {
    case "eip155":
      return EIP155_SIGNING_METHODS;

    case "tron":
      return TRON_SIGNING_METHODS;

    case "solana":
      return SOLANA_SIGNING_METHODS;

    default:
      return EIP155_SIGNING_METHODS;
  }
}

export const getChainData = (chain, chainType) => {
  const getChainData = getRequestedChainList(chainType)
  // console.log('getcchianain---->', chain, chainType, getChainData);
  return chainType == "solana" ? getChainData : getChainData[String(chain)]
}


export const getSupportedNetChains = (requiredNamespaces, optionalNamespaces, chainType) => {
  try {
    console.log('requiredNamespaces---->', requiredNamespaces, optionalNamespaces, chainType, Object.entries(requiredNamespaces), Object.entries(optionalNamespaces));

    if (!requiredNamespaces && !optionalNamespaces) {
      return [];
    }

    const required = [];
    for (const [key, values] of Object.entries(requiredNamespaces)) {
      const chains = key.includes(':') ? key : values.chains;
      if (chains) {
        required.push(chains);
      }
    }

    const optional = [];
    for (const [key, values] of Object.entries(optionalNamespaces)) {
      const chains = key.includes(':') ? key : values.chains;
      if (chains) {
        optional.push(chains);
      }
    }

    const chains = [...required.flat(), ...optional.flat()];
    console.log('chainschainschains---->', chains);
    return chains
      .map(chain => getChainData(chain.split(':')[1], chainType))
      .filter(chain => chain);

  } catch (e) {
    console.log('errrr---->', e);
    return []
  }
}

export const BeatifyConsole = (key, value) => console.log(key, JSON.stringify(value, null, 2))

export const isEmpty = (value) =>
  value === undefined ||
  value == "undefined" ||
  value === null ||
  value == false ||
  value == "false" ||
  (typeof value === "object" && Object.keys(value).length === 0) ||
  (typeof value === "object" && Array.isArray(value) && value.length === 0) ||
  (typeof value === "string" && value.trim().length === 0) ||
  (typeof value === "string" && value === "0") ||
  (typeof value === "number" && value === 0);

export const addressshowing = (data) => {
  if (data?.length > 10) {
    var address = data?.substring(0, 10) + '...' + data?.substring(data.length - 11, data.length - 1)
  } else {
    var address = data
  }
  return address
}


export const getImageUrl = async (imageUrl, siteUrl) => {
  try {
    const splitDomainName = siteUrl.split("/");
    const getDomainName = splitDomainName[2];

    console.log("Domain Name:", getDomainName);

    try {
      await axios.get(imageUrl, { responseType: 'blob' }); // Fetch image as a blob
      console.log("Primary image fetched successfully.");
      return imageUrl;
    } catch (primaryError) {
      console.warn("Primary image fetch failed, attempting fallback.", primaryError);
      try {
        await axios.get(`${siteUrl}favicon.ico`, { responseType: 'blob' });
        console.log("Fallback favicon fetched successfully.");
        return `${siteUrl}favicon.ico`;
      } catch (e) {
        console.log('Erron on favicon fetch---->', e);
        await axios.get(`https://api.faviconkit.com/${getDomainName}/64`, { responseType: 'blob' });
        return `https://api.faviconkit.com/${getDomainName}/64`
      }
    }
  } catch (e) {
    console.error("Error in getImageUrl:", e);
    return null;
  }
};


export const ImageComponent = ({ icons, url, style }) => {
  const [imageUri, setImageUri] = useState(null);

  useEffect(() => {
    const loadImage = async () => {
      const uri = await getImageUrl(icons, url);
      setImageUri(uri);
    };
    loadImage();
  }, [icons, url]);

  if (!imageUri) {
    return null;
  }

  return (
    <Image source={{ uri: imageUri }} style={style} />
  );
};

export const sleep = async (ms) => new Promise(res => setTimeout(() => res(), ms));