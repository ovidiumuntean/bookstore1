const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const config = require('../config/database');
const Customer = require('../models/customer');
const Administrator = require('../models/administrator');

module.exports = function(passport) {
  let opts = {};
  opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme('jwt');
  opts.secretOrKey = config.secret;
  passport.use(new JwtStrategy(opts, (jwt_payload, done) => {
    if(jwt_payload.data.permission === 'customer'){
        Customer.findOne({where: {email: jwt_payload.data.email}}).then(user => {
            if(!user){
                return done(err, false);
            }else {
                return done(null, user);
            }
        });
    } else if(jwt_payload.data.permission === 'admin' || jwt_payload.data.permission === 'admin_user') {
        Administrator.findOne({where: {email: jwt_payload.data.email}}).then(user => {
            if(!user){
                return done(err, false);
            } else{
                return done(null, user);
            }
        });
    }
  }));
}
