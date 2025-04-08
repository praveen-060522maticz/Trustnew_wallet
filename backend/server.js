// import packages
import express from "express";
import cors from "cors";
import https from "https";
import http from "http";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import morgan from "morgan";
import passport from "passport";
import path from "path";
import fileupload from 'express-fileupload'



// import routes
import user from "./routes/front_routes/Userroutes";


//stripe

// config
import config from "./config/config";
import { Decryptdata } from "./commenfunction/commenfunction";

//    Console Hide

// console.log=()=>{}
// console.warning = ()=>{}
// console.info=()=>{}
// console.error=()=>{}

//    Console Hide

const app = express();
const server = http.createServer(app);
//passport
app.use(passport.initialize());
require("./config/passport").usersAuth(passport);

// compress responses
app.use(morgan("dev"));
app.options("*", cors());




app.use(express.json())
app.use(fileupload())

app.use(express.urlencoded({
    extended: true
}));

app.use(bodyParser.json());

app.use("/", express.static(path.join(__dirname, "public")));

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  next();
});

app.use(
  async(req, res, next) => {
    let method = req.method
 let contentype = req.headers['content-type'];
 console.log("methodmethodmethodmethodmethodmethod",contentype);

    if(method == "GET" || method == "get"){
      if(req.query.data)
      {
        req.query = Decryptdata(req.query.data);
        return next()
      }
      else return next()
    }
    if(method == "POST" || method == "post" || method == 'OPTIONS' || method == 'options'){
      console.log('req.body?.datareq.body?.data',req.body?.data)
      if(contentype?.includes('multipart/form-data')){
        
        await Promise.all(Object.keys(req?.body).map(async(val)=>{
             if(val?.type) {
              req.files[val] =req?.body[val]}
             else  {
              req.body[val] = Decryptdata(req?.body[val])
          }
        }))
        return next()
      }
      else if(contentype?.includes('application/json')){
        if(req.body?.data){
          req.body = Decryptdata(req.body?.data);
        }
        return next()
      }
      // else if(contentype?.includes('skip')){
      //   console.log("skipppppppppppp");
      //   // req.body = Decryptdata(req.body?.data);
      //   return next()
      // }

        
      } 

  
});




// Database connection
mongoose
  .connect(config.mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    // useCreateIndex: true,
  })
  .then(() => console.log("MongoDB successfully connected."))
  .catch((err) => console.log(err));

app.use("/user", user);


// app.use("/api", Admin);

app.get("/", (req, res) => {
  return res.send("User Service Working");
});

server.listen(config.port, function () {
  console.log(`server is running on port ${config.port}`);

});
  