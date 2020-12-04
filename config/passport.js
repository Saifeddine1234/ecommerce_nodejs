const passport = require('passport')
const bcrypt = require('bcrypt')
const localStrategy = require('passport-local').Strategy
const flash = require('connect-flash')
const User = require('../models/User')
var Cart = require('../models/Cart')
passport.serializeUser((user, done) => {
   return done(null, user.id)
    
})
passport.deserializeUser((id, done) => {
User.findById(id ,('email userName contact address') ,(err , user) => {
   Cart.findById(id , (err , cart) => {
      if(!cart){
         return done(err , user)
      }
      user.cart = cart
      return done(err , user)
   })
})})
passport.use('local-signin' , new localStrategy({
    usernameField : 'email' ,
    passwordField : 'password' ,
    passReqToCallback : true 
} , (req , email , password , done ) => {
 User.findOne({email : email} , (err , user) => {
     if(err) {
        return done(null , false , req.flash('signinError' , 'remplir sous form email'))
     }
     if(!user){
        return done(null , false , req.flash('signinError' , 'email nexite pas'))
     }
  if(!bcrypt.compareSync(password, user.password)){
    return done(null , false , req.flash('signinError' , 'password false'))
}
return done(null , user)  

 })
    }
))
passport.use('local-signup' , new localStrategy({
   usernameField : 'email' , 
   passwordField : 'password' ,
   passReqToCallback : true
} ,  (req , email , password , done) => {
   User.findOne({email : email} ,  (err , user) => {
      if(err){
         return done(err)
      }
      if(user){
         return done(null , false , req.flash('error' , 'email exist'))
      }
      var hach = bcrypt.hashSync(password , 10) 
      const newUser =  new User({
         email : email , 
         password : hach })
      newUser.save((err , doc) => {
         if(err){
            return done(err)
         }if(doc){
            return done(null ,doc)
         }
      })
   })
}))
