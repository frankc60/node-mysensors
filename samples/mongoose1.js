"use strict";

var mongoose = require('mongoose')
  , db = mongoose.createConnection('localhost', 'test');

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    var kittySchema = new mongoose.Schema({
        name: String
    });
       
    kittySchema.methods.speak = function() {
        var greeting = this.name ? "Meow name is" + this.name : "I don't have a name";
        console.log(greeting);
    };

var Kitten = db.model('Kitten', kittySchema);
    var silence = new Kitten({name: 'Silence'});
    console.log(silence.name);
 


    var fluffy = new Kitten({name: 'fluffy'});


// ... this line.
var Kitten = db.model('Kitten', kittySchema);


    

    fluffy.save(function(err) {
        console.log('meow');
    });

fluffy.speak();

    function logResult(err, result) {
        console.log(result);
    }

    Kitten.find(logResult);
    Kitten.find({name: /fluff/i }, logResult);
    console.log("finished");
});


 var userSchema = new mongoose.Schema({
      name: {
        first: String,
        last: { type: String, trim: true }
      },
      age: { type: Number, min: 0 }
    });

    var PUser = mongoose.model('PowerUsers', userSchema);
    
    // Creating one user.
    var johndoe = new PUser ({
      name: { first: 'John', last: '  Doe   ' },
      age: 25
    });

    // Saving it to the database.
    johndoe.save(function (err) {if (err) console.log ('Error on save!')});

    function createWebpage (req, res) {
      // Let's find all the documents
      PUser.find({}).exec(function(err, result) {
    if (!err) {
      res.write(html1 + JSON.stringify(result, undefined, 2) +  html2 + result.length + html3);
      // Let's see if there are any senior citizens (older than 64) with the last name Doe using the query constructor
      var query = PUser.find({'name.last': 'Doe'}); // (ok in this example, it's all entries)
      query.where('age').gt(64);
      query.exec(function(err, result) {
        if (!err) {
          res.end(html4 + JSON.stringify(result, undefined, 2) + html5 + result.length + html6);
        } else {
          res.end('Error in second query. ' + err)
        }
      });
    } else {
      res.end('Error in first query. ' + err)
    };
      });
    }
