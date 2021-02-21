var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var db = mongoose.connect('mongodb://localhost/swag-shop');

var Product = require('./model/product');
var WishList = require('./model/wishlist');


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.post('/product', function (request, response) {
    var product = new Product();
    product.title = request.body.title;
    product.price = request.body.price;
    // product.likes = 0;
    product.save(function (err, savedProduct) {
        if (err) {
            response.status(500).send({error: 'Could not save product'})
        } else {
            response.status(200).send(savedProduct);
        }
    });
});

app.post('/wishlist', function (request, response) {
    var wishList = new WishList();
    wishList.title = request.body.title;

    wishList.save(function (err, newWishList) {
        if (err) {
            response.status(500).send({error: 'Could not create product'});
        } else {
            response.status(200).send(newWishList);
        }
    })
});

app.get('/wishlist', function (request, response) {
    WishList.find({}).populate({path: 'products', model: 'Product'}).exec(
        function (err, wishLists) {
            if (err) {
                response.status(500).send({error: 'Could not get wish List'});
            } else {
                response.status(200).send(wishLists);
            }
        }
    )
});

app.get('/product', function (request, response) {
    Product.find({}, function (err, products) {
        if (err) {
            response.status(500).send('Could not fetch products')
        } else {
            response.status(200).send(products)
        }
    });
});

app.put('/wishlist/product/add', function (request, response) {
    Product.findOne({_id: request.body.productId}, function (err, product) {
        if (err) {
            response.status(500).send({error: 'Could not add item to wish list'});
        } else {
            WishList.update(
                {_id: request.body.wishListId},
                {
                    $addToSet:
                        {products: product._id}
                },
                function (err, wishList) {
                    if (err) {
                        response.status(500).send({error: 'Could not add item to wish list'})
                    } else {
                        response.status(200).send(wishList);
                    }
                })
        }
    });
});

app.listen(3004, function () {
    console.log("Swag Shop API running on port 3000...");
});
