const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');
const config = require('../config/database');
const bcrypt = require('bcryptjs');

module.exports = function(passport){
  // Local Strategy
  passport.use(new LocalStrategy(function(username, password, done){
    // Match Username
    let query = {username:username};
    User.findOne(query, function(err, user){
      if(err) throw [err];
      if(!user){
        //console.log("no user found")
        return done(null, false, [{error: 'No user found'}]);
      }

      // Match Password
      bcrypt.compare(password, user.password, function(err, isMatch){
        if(err) throw [err];
        if(isMatch){
          //console.log("user :",user)
          return done(null,user,[{success:"Login Successful"}]);
        } else {
          //console.log("wrong password")
          return done(null, false, [{error: 'Wrong password'}]);
        }
      });
    });
  }));

  passport.serializeUser(function(user, done) {
    //console.log("Serialize user runs")
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });
}
