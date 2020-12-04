const Produit = require('../models/Produit')
const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost:27017/sc' , {useNewUrlParser : true ,useUnifiedTopology: true})
mongoose.connection.once('open' , () => console.log('connect to DB'))
mongoose.connection.on('error' , (error) => console.log(error))

const produits =[ 
new Produit({
    prix : 566 ,
    nom : 'huawei' ,
    urlimage : '/images/huawei.jpg' , 
    information : {
        capacite : 64 ,
        sim : 'SIM' ,
        ram : 2
    }
   
}),
new Produit({
    prix : 4500 ,
    nom : 'iphone 11 pro max' ,
    urlimage : '/images/i11.jpg' , 
    information : {
        capacite : 128 ,
        sim : 'sim' ,
        ram : 6
    }
    
}),
new Produit({
    prix : 1466 ,
    nom : 'huawei' ,
    urlimage : '/images/huaweiy9s.jpg' , 
    information : {
        capacite : 128 ,
        sim : 'SIM' ,
        ram : 4
    }
    
}),
new Produit({
    prix : 1066 ,
    nom : 'huawei' ,
    urlimage : '/images/huaweip8.jpg' , 
    information : {
        capacite : 64 ,
        sim : 'SIM' ,
        ram : 3
    }
    
})
]
for(var i = 0 ; i < produits.length ; i++){
    produits[i].save()
}


