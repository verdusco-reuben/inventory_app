// Require the Express Module
var express = require('express');
// Create an Express App
var app = express();
// Require body-parser (to receive post data from clients) & path
var bodyParser = require('body-parser');
var path = require('path');
// Session
var session = require('express-session');
app.use(session({secret: 'reubeniscool'})); 

// Directing Express on where to find static content
app.use(express.static(path.join(__dirname, "./static")));
// Integrate body-parser with our App
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(express.static(path.join(__dirname, './static')));
app.set('views', path.join(__dirname, './views'));
// Setting our View Engine set to EJS
app.set('view engine', 'ejs');

//kinda like a MongoDB ORM
var mongoose = require('mongoose');
//name of the database
mongoose.connect('mongodb://localhost/inventory_app');
mongoose.Promise = global.Promise;

// // used for OneToMany
// var Schema = mongoose.Schema;

//create a schema 
var ProductSchema = new mongoose.Schema({
    category: {type: Number, required: true},
    SKU: {type: Number, required: true, minlength: 3},
    desc: {type: String, required: true},
    vendor: {type: String},
    color: {type: String, required: true},
    qty: {type: Number, required: true},
},{
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at'}
});

//store the schema and give it a string name
mongoose.model('Product', ProductSchema);
//get the schema and store it in a usable var
var Product = mongoose.model('Product');


// Root Request
app.get('/', function(req, res) {
    Product.find({})
        // .populate('friends')
        .exec(function(err, all_items) {
            res.render('index',{all_items:all_items});
    });
})

// Post request
app.post('/newitem', function(req, res) {
    console.log("POST DATA", req.body);
    // if( data is incomplete ){
    //     res.render('index', {errors : {err:{message:"data is incomplete"}}})
    // }else{
        //store post data into a new mongoose.model variable
        var item = new Product({
            category: req.body.category,
            SKU: req.body.SKU,
            desc: req.body.desc,
            vendor: req.body.vendor,
            color: req.body.color,
            qty: req.body.qty
        });
        //attatch .save function to that variable
        item.save(function(err) {
            // if there is an error console.log that something went wrong!
            if(err) {
                console.log('something went wrong');
                res.redirect('/');
                // res.render('index', {errors : item.errors, all_items : [{}]})
            } else { // else console.log that we did well and then redirect
                console.log('successfully added an item!');
                res.redirect('/');
            }
        })
    // }
});


// Setting our Server to Listen on Port: 8000
app.listen(8000, function() {
    console.log("listening on port 8000");
})