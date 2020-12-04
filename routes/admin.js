var express = require("express");
var router = express.Router();
var mongoose = require("mongoose");
var Produit = require("../models/Produit");
var User = require("../models/User");

var Cart = require("../models/Cart");
var Order = require("../models/Order");

router.get("/admin",(req, res, next) => {
    res.render('admin/admin.ejs')
});
router.get("/affichepr",(req, res, next) => {
   Produit.find((err, produit) => {
    if (err) {
      console.log(err);
    } else {
        console.log(produit)
        res.render('admin/affichepr.ejs' ,{ produit : produit} )

    }
   })
});
router.get("/afficheuser",(req, res, next) => {
    User.find((err, user) => {
        if (err) {
          console.log(err);
        } else {
            console.log(user)
    res.render('admin/afficheuser.ejs',{ user : user}) }
        })

});
router.get("/statistique",(req, res, next) => {
    Order.find((err, order) => {
        if (err) {
          console.log(err);
        } else {
            console.log(order)
      
    res.render('admin/statistique.ejs' , {order : order})}
})
})
        
        
router.get("/supprimeruser/:id" , (req , res , next )=> {
    const id = req.params.id
    User.deleteOne({_id : id} , (err , doc ) => {
        if(err){
            console.log(err) 
        }else {
            res.redirect('/a/afficheuser')
        }
    })
})
router.get("/supprimerpr/:id" , (req , res , next )=> {
    const id = req.params.id
    Produit.deleteOne({_id : id} , (err , doc ) => {
        if(err){
            console.log(err) 
        }else {
            res.redirect('/a/affichepr')
        }
    })
})
router.get("/modifierpr/:id" , (req , res , next )=> {
    const id = req.params.id
    Produit.findById({_id : id}, (err, produit) => {
        if (err) {
          console.log(err);
        } else {
            console.log(produit)
res.render('admin/modifierpr.ejs' , {id : id , i : produit})
  
}})})
router.get("/supprimercommande/:id" , (req , res , next )=> {
    const id = req.params.id
    Order.deleteOne({_id : id} , (err , doc ) => {
        if(err){
            console.log(err) 
        }else {
            res.redirect('/a/affichecommandes')
        }
    })
})
router.get("/affichecommandes",(req, res, next) => {
    Order.find((err, order) => {
        if (err) {
          console.log(err);
        } else {
            console.log(order)
    res.render('admin/affichecommandes.ejs' , {order : order})}
        })})


router.get("/ajouterpr",(req, res, next) => {
    res.render('admin/ajouterpr.ejs')}
        )
router.post("/ajouterpr",(req, res, next) => {
    const produit = new Produit({
        prix: req.body.prixproduit,
        nom: req.body.nomproduit,
        urlimage: req.body.urlproduit,
        information:{
           capacite : req.body.capacite,
            sim: req.body.sim,
            ram: req.body.ram,
        }
      });
      produit.save((err, result) => {
        if (err) {
          console.log(err);
        }

        console.log(result);
      });
      res.redirect("/a/affichepr");

      });
      router.post("/modifierpr/modifierpr",(req, res, next) => {
        var produit={
            prix: req.body.prixproduit,
            nom: req.body.nomproduit,
            urlimage: req.body.urlproduit,
            information:{
               capacite : req.body.capacite,
                sim: req.body.sim,
                ram: req.body.ram,
            }
          }
          
          Produit.updateOne({_id : req.body.id } , {$set : produit}, (err , result) => {
            if (err) {
              console.log(err);
            }
            res.redirect("/a/affichepr");
            console.log(result);
          });
    
          });


module.exports = router;
