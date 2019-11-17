var ObjectID = require('mongodb').ObjectID;
var IndexVerified = false;

function donations(db){
    var Model = {};
    var Collection = db.collection('donations');
    
    if(!IndexVerified){
        Collection.indexExists("donid_1", (err, result)=>{
            if(!result){
                Collection.createIndex(
                    {"donid" : 1},
                    {unique : true, name: "donid_1"},
                    (err, result)=>{
                        console.log(err);
                        console.log(result);
                    }
                );            
            }
        });
    }

    Model.getAllDonations = (handler)=>{
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

    Model.getDonation = (id, handler)=>{
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

    Model.updateDonation = (cambios, id, handler)=>{
        let query = {"_id": new ObjectID(id)};
        let updateObject = {
            "$set":{
                "dateModified":new Date().getTime(),
                "descripcion" : cambios.descripcion,
                "categoria" : cambios.categoria
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

    Model.newDonation = (newDonation, handler)=>{
        Collection.insertOne(newDonation, (err, result)=>{
          if(err){
            console.log(err);
            return handler(err, null);
          }
          return handler(null, result);
        }); 
    }

    Model.deleteDonation = (id, handler) =>{
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

module.exports = donations;