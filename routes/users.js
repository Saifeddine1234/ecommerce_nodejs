var express = require('express');
var router = express.Router();
const User = require('../models/User')
const Order = require('../models/Order')
const bcrypt = require('bcrypt')
const csrf = require('csurf')
router.use(csrf())
var { check , validationResult } = require('express-validator');
const passport = require('passport');
/* GET users listing. */
router.get('/signup',isNotSignin, function(req, res, next) {
  const messageserror = req.flash('error')
  res.render('user/signup' , {messageserror : messageserror ,check : req.isAuthenticated() , token : req.csrfToken()})
});
router.post('/signup' , [ 
  check('email').not().isEmpty().withMessage('remplir le champ email !') ,
  check('email').isEmail().withMessage('remplir sous form email') ,
check('password').not().isEmpty().withMessage('remplir le champ de mot de passe !') ,
check('password').isLength({min : 6}).withMessage('tres court mot de passe ') ,
check('cpassword').custom((value , {req}) => {
if(value !== req.body.password){
  throw new Error('non confondu')
}
return true
})] , async (req , res , next) => {
  const errors = validationResult(req)
if(!errors.isEmpty()){
  var msg = []
for(var i = 0 ; i < errors.errors.length ; i++) {
msg.push(errors.errors[i].msg)
} 
console.log(msg)
req.flash('error' , msg)
res.redirect('signup')

  return ;
}
next();
}, passport.authenticate('local-signup' , {
  session : false ,
  successRedirect : 'signin' ,
  failureRedirect : 'signup' ,
  failureMessage : true
}))
router.get('/signin',isNotSignin , function(req, res, next) {
 
  const error = req.flash('signinError')
  res.render('user/signin' , {error : error ,check : req.isAuthenticated() , token : req.csrfToken()})
});
router.post('/signin', passport.authenticate('local-signin' , {
  successRedirect:'profil' ,
  failureRedirect : 'signin' ,
  failureFlash : true
}))
router.get('/profil', isSignin, (req, res, next) => {
  if(req.user.cart){
    QPr = req.user.cart.Quantite
  }else{
    QPr = 0
  }

  Order.find({user : req.user._id} , (err , result)=>{
    if(err){
      console.log(err)
    }
    console.log(result)
var error = req.flash('errorprofil')
var haserrorprofil = false 
if(error.length > 0){
  haserrorprofil = true 

}
  res.render('user/profil' ,{check : req.isAuthenticated() , user : req.user , haserrorprofil : haserrorprofil ,token : req.csrfToken() , error : error , QPr : QPr , order : result})
})
});
router.get('/logout' , (req , res , next) => {
  req.logOut()
  res.redirect('/')
  req.isAuthenticated
})
function isSignin(req ,res , next){
  if(!  req.isAuthenticated()){
    res.redirect('/users/signin')
    return;
  }
  next()
}
function isNotSignin(req ,res , next){
  if( req.isAuthenticated()){
    res.redirect('/')
    return;
  }
  next()
}
router.post('/updateuser' ,  [ 
  check('username').not().isEmpty().withMessage('remplir le champ nom !') ,
  check('email').isEmail().withMessage('remplir sous form email') ,
  check('email').not().isEmpty().withMessage('remplir le champ email !') ,
  check('contact').not().isEmpty().withMessage('remplir le champ numero !') ,
  check('address').not().isEmpty().withMessage('remplir le champ d adresse !') ,
check('password').not().isEmpty().withMessage('remplir le champ de mot de passe !') ,
check('password').isLength({min : 6}).withMessage('tres court mot de passe ') ,
] , async (req , res , next) => {
  const errors = validationResult(req)
  if(!errors.isEmpty()){
    var msg = []
  for(var i = 0 ; i < errors.errors.length ; i++) {
  msg.push(errors.errors[i].msg)
  
  } 
  console.log(msg)
  req.flash('errorprofil' , msg)
  res.redirect('profil#contact')
  
    return 
     }else{
    console.log('modifier')
   var Newuser = {
      email : req.body.email ,
      password : bcrypt.hashSync( req.body.password , 10) ,
      userName : req.body.username, 
      contact : req.body.contact, 
      address : req.body.address ,
  }
  User.updateOne({_id : req.user._id} , {$set : Newuser} , (err , doc) => {
if(err){
  console.log(err)
}else{
  console.log(doc)
  res.redirect('profil')
}
  })
}
})
module.exports = router;
