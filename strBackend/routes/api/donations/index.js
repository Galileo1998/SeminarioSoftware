
function initApiDonations(db){
    
    var express = require('express');
    var router = express.Router();
    var Model = require('./donations.model')(db);

    router.get('/all', (req, res)=>{
        Model.getAllDonations((err, products)=>{
            if(err){
                res.status(404).json([]);
            }else{
                res.status(200).json(products);
            }
        })
    });
    
    router.get('/donation/:donid', (req, res)=>{
        var id = req.params.donid;
        Model.getDonation(id, (err, result)=>{
            if(err){
                res.status(404).json({"error" : err});
            }else{
                res.status(200).json(result);
            }
        });
    });

    router.post('/new', (req, res)=>{
        // if (req.user.roles.findIndex((o)=>{return o=="administrador"}) == -1) {
        //     return res.status(401).json({"error":"Sin privilegio"});
        // }
          var newDonation = Object.assign(
             {},
             req.body,
             { "fecha" : new Date().getTime(),
              "createdBy": req.user 
             }
           );

          Model.newDonation(newDonation, (err, result)=>{
            if(err){
              res.status(500).json(err);
            }else{
              res.status(200).json(result);
            }
          });
    });

    router.put('/update/:donid', (req, res)=>{
        var donid = req.params.donid;
        var descripcion = req.body.descripcion;
        var categoria = req.body.categoria;
        Model.updateDonation(
            {"descripcion" : descripcion,
             "categoria" : categoria   
            }, 
            donid,
            (err, rsult)=>{
                if(err){
                    res.status(500).json({"error":"Lo sentimos mucho, ha ocurrido un error."});
                }else{
                    res.status(200).json(rsult);
                }
            }
        )
    });

    router.delete('/del/:donid', (req, res)=>{
        var id = req.params.donid ;
       
        Model.deleteDonation(id , (err, result)=>{
            if(err){
                res.status(500).json({"error":"Ocurrio un error intente de nuevo."});
            }
            res.status(200).json({"msg":"Deleted OK"});
        }); 
    });

    return router;   
}
module.exports = initApiDonations;