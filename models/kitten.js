var mongoose = require("mongoose");

mongoose.connect('mongodb://localhost/test', function(err) {
	if(err) throw err;
});


var Schema = mongoose.Schema;

var kittenSchema = new Schema({
	name: String
});

module.exports = mongoose.model('Kitten', kittenSchema);


