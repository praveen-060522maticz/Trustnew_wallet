// import package
import mongoose from "mongoose";
import jwt from "jsonwebtoken";

// import lib
import config from "../config/config";

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const UserSchema = new Schema({
  deviceId: {
    type: String,
    default: "",
  },
  Username: {
    type: String,
},

Email: {
    type: String,
    default: "string"
},

Password: {
    type: String,
    default: "string"

},
encryptedPassword: {
  type: String,
  default: "string"

},
Phonennumber: {
  type: String,
  default: "string"

},
ConnectedWallets: {
  type: [],
  // default: "string"

},
Wallettype: {
  type: String,
  default: "string"

},
paymentstatus: {
  type: Boolean,
  default: false

},
paymentmethod: {
  type: String,
  default: ""

},

  created_date: {
    type: Date,
    default: Date.now,
  }
});

UserSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

UserSchema.set("toJSON", {
  virtuals: true,
});

UserSchema.methods.generateJWT = function (payload) {
  var token = jwt.sign(payload, config.secretOrKey);
  return `Bearer ${token}`;
};


module.exports = mongoose.model("users", UserSchema, "users");
