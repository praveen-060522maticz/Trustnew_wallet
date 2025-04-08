//import npm package
const
    JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;

//import function
import config from './config';

var opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = config.secretOrKey;

//import model
import  User  from '../models/User.schema';

export const usersAuth = async (passport) => {
    passport.use("usersAuth",
        new JwtStrategy(opts, async function (jwt_payload, done) {

try{
            var Token= await User.findById(jwt_payload._id)
           if(Token){
            let data = {
                            id: Token._id,
                        }
                        return done(null, Token);
           }
           else{
                            return done(null, false)

           }
        }
        catch(err){
            console.log("error",err);
            return done(err, false)
        }

        })
    )
}