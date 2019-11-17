var express = require('express');

var router = express.Router();

function initApiProducts(db){
    
    var Model = require('./products.model')(db);    

    router.get('/', (req, res)=>{
        res.status(200).json({"api" : "donations"});
    });

    router.get('/all', (req, res)=>{
        Model.getAllProducts((err, products)=>{
            if(err){
                res.status(404).json([]);
            }else{
                res.status(200).json(products);
            }
        })
    });
    
    router.get('/product/:prdid', (req, res)=>{
        var id = req.params.prdid;      
        Model.getProduct(id, (err, doc)=>{
            if(err){
                res.status(500).json(err);
            }else{
                res.status(200).json(doc);
            }
        });
    });

    router.post('/new', (req, res)=>{
        // if (req.user.roles.findIndex((o)=>{return o=="administrador"}) == -1) {
        //     return res.status(401).json({"error":"Sin privilegio"});
        // }
          var newProd = Object.assign(
             {},
             req.body,
             { "stock":parseInt(req.body.stock),
               "price":parseFloat(req.body.price),
               "createdBy": req.user }
           );

          Model.newProduct(newProd, (err, result)=>{
            if(err){
              res.status(500).json(err);
            }else{
              res.status(200).json(result);
            }
          });
    });

    router.put('/update/:prdid', (req, res)=>{
        var id = req.params.prdid;
        var amountToAdjust = parseInt(req.body.ajustar);
        var adjustType = req.body.tipo || 'SUB';
        Model.updateProduct(
            {stock:amountToAdjust,
            type:adjustType}, id,
            (err, result)=>{
                if(err){
                    res.status(500).json({"error":"Lo sentimos mucho, ha ocurrido un error."});
                }else{
                    res.status(200).json(result);
                }
            }
        )
    });

    router.delete('/del/:prdid', (req, res)=>{
        var id = req.params.prdid || '';
       
        Model.deleteProduct(id , (err, rslt)=>{
            if(err){
                res.status(500).json({"error":"Ocurrio un error intente de nuevo."});
            }
            res.status(200).json({"msg":"Deleted OK"});
        }); 
    });

    return router;
}
module.exports = initApiProducts;