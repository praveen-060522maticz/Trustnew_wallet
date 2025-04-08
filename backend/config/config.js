import dotenv from 'dotenv'
dotenv.config({path:`./env/.env.${process.env.NODE_ENV}`})

var EnvName = process.env.NODE_ENV;
let key = {};


if (EnvName === "demo") {
  console.log("Set Production Config");
  key = {
    mongoURI: process.env.MONGOURI,
    port:  process.env.PORT,
    siteUrl:  process.env.SITE_URL,
    BNB_rpc_url:"https://bsc-rpc.publicnode.com",
    ETH_rpc_url:"https://ethereum-rpc.publicnode.com",
    Tron_rpc_url:"https://api.trongrid.io",
    BTC_rpc_url:"https://api.blockcypher.com/v1/btc/main",

    
    secretOrKey:  process.env.secretOrKey,
    emailGateway: {
      fromMail: process.env.user,
      nodemailer: {
        host: "smtp.zoho.com",
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
          user: process.env.user, // generated ethereal user
          pass: process.env.pass, // generated ethereal password
        },
      },
    },

 
  };
}

 else {
  key = {

    mongoURI: process.env.MONGOURI,
    port:  process.env.PORT,
    siteUrl:  process.env.SITE_URL,
    BNB_rpc_url:"https://data-seed-prebsc-1-s1.bnbchain.org:8545",
    ETH_rpc_url:"https://goerli.infura.io/v3/d2852230ae684b21b3a9950fc4afb696",
    BTC_rpc_url:"https://api.blockcypher.com/v1/btc/test3",
    Tron_rpc_url:"https://nile.trongrid.io",
    secretOrKey:  process.env.secretOrKey,
    emailGateway: {
      fromMail: process.env.user,
      nodemailer: {
        host: "smtp.zeptomail.com",
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
          user: process.env.user, // generated ethereal user
          pass: process.env.pass, // generated ethereal password
        },
      },
    },



 
  };
}

export default key;
