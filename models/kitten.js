//do require for mongoose here, means don´t need to do in master file.
var mongoose = require("mongoose");
//****************************************************
//connect to mongodb
mongoose.connect('mongodb://localhost/test', function(err) {
	if(err) throw err;
});
//****************************************************
var Schema = mongoose.Schema;
//****************************************************
//define schemas
/*var kittenSchema = new Schema({
	name: String
});
var kitten = mongoose.model('Kitten', kittenSchema);
*/
//-----
var mysensorsSchema = new Schema({
    a1: String,
    a2: String,
    a3: String,
    s: String,
    c: String,
    t: String,
    pt: String,
    l: String,
    sg: String,
    data: String,
    timestamp: Date,
    timestamp2: Date
});

//data model 1-many
//nodeID 1-m sensorid - 1 data

mysensorsSchema.pre('save', function(next) {
    var currentTS = new Date();
    this.timestamp2 = currentTS;
    next();  
});


var mysensors = mongoose.model("mysensors",mysensorsSchema);
//-----

//****************************************************
// save/insert a new document in Mongoose
var updateMongoose = function(mdl,obj) {
    //console.log("mdl:" + mdl + ", obj:" + obj);

    var tmp = new mdl(obj);
    tmp.save(function(err,tmp2) {
        if(err) return console.error(err);    
        console.log("updateMongoose::saved: " + tmp2);
    });

};
//****************************************************

//export modules for import by a require statement in master js file.
//module.exports.kitten = kitten;
module.exports.mysensors = mysensors;
module.exports.updateMongoose = updateMongoose;


