user strict;

//model / schema

var mongoose = require("mongoose");
var Schema = mongoose.Schema;

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
    timestamp: {
    	type: String,
    	default: Date.now,
    	requird: true
    }
});

module.exports = mongoose.model("mysensor", mysensorsSchema);
