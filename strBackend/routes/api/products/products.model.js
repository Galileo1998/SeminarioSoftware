var ObjectID = require('mongodb').ObjectID;
var IndexVerified = false;

function products(db){
    var Model = {};
    var Collection = db.collection('products');
    
    if(!IndexVerified){
        Collection.indexExists("prdid_1", (err, result)=>{
            if(!result){
                Collection.createIndex(
                    {"prdid" : 1},
                    {unique : true, name: "prdid_1"},
                    (err, result)=>{
                        console.log(err);
                        console.log(result);
                    }
                );            
            }
        });
    }

    Model.getAllProducts = (handler)=>{
        Collection.find({}).toArray(
            (err, docs)=>{
                if(err){
                    console.log(err);
                    return handler(err, null);
                }
                return handler(null, docs);
            }
        )
    }

    Model.getProduct = (id, handler)=>{
        let query = {"_id": new ObjectID(id)};

        Collection.find(query).toArray(
            (err, doc)=>{
                if(err){
                    console.log(err);
                    return handler(err, null);
                }
                return handler(null, doc);
            }
        );
    }

    Model.newProduct = (newProduct, handler)=>{
        Collection.insertOne(newProduct, (err, result)=>{
          if(err){
            console.log(err);
            return handler(err, null);
          }
          return handler(null, result);
        }); 
    }

    Model.updateProduct = (cambios, id, handler)=>{
        let query = {"_id": new ObjectID(id)};
        let updateObject = {
            "$set": {
                "dateModified":new Date().getTime()
            },
            "$inc": {
                "stock": (
                    (cambios.type=="ADD") ?
                        cambios.stock:
                        (cambios.stock*-1)
                    )
            }
        }

        Collection.updateOne(
            query,
            updateObject,
            (err, result)=>{
                if(err){
                    return handler(err, null);
                }
                return handler(null, result);
            }
        )
    }

    Model.deleteProduct = (id, handler) =>{
        var query = {"_id": new ObjectID(id)};
        Collection.deleteOne(query, (err, result)=>{
            if(err){
                console.log(err);
                return handler(err, null);
            }
            return handler(null, result);
        });
    }

    return Model;
}

module.exports = products;