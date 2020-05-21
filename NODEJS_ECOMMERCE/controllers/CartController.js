const db = require("../db.js");
const mongoist = require('mongoist');
const PLUSTAX = 1.13;

//CART POST ADD TO CART (WORKS)
module.exports.add = async function (request, response) {
    try {
        let status = false;
        let message = "";
        let product = request.body;
        let user = await db.conn.Users.findOne({ _id: mongoist.ObjectId(request.session.user) });
        

        if (product.hasOwnProperty('productid') && product.productid &&
            product.hasOwnProperty('qty') && product.qty) {
            if (user) {
                var existCheckProduct = user.cart.products.filter(a => a._id.equals(mongoist.ObjectId(product.productid)));
                if (existCheckProduct.length == 0) {
                   let dbproduct = await db.conn.Products.findOne({ id: parseInt(product.productid) });                  
                    var productToAdd = {
                        _id: dbproduct.id,
                        name: dbproduct.name,
                        description: dbproduct.description,
                        qty: parseInt(product.qty),
                        imagePath: dbproduct.imagePath,
                        price: parseFloat(dbproduct.price),
                        tax: (parseFloat(dbproduct.price) * PLUSTAX),
                        shippingCost: (10)
                    };
                    user.cart.products.push(productToAdd);
                    user.cart = recalculateCart(user.cart);
                    await db.conn.Users.save(user);
                    status = true;
                    message = "Added successfully";
                } else {
                    status = false;
                    message = "Product already in cart";
                }
            } else {
                status = false;
                message = "User not found";
            }
        } else {
            status = false;
            message = "Insuffient Data.";
        }
        response.json({ status: status, message: message });
        return response;
    } catch (e) {
        response.json({ status: false, message: e.message });
    }
}

//CART DELETE FROM CART
module.exports.delete = async function (request, response) {
    try {
        let status = false;
        let message = "";
        let user = await db.conn.Users.findOne({ _id: mongoist.ObjectId(request.session.user) });
        if (user) {
           // var productToDelete = user.cart.products.filter(a => a._id.equals(mongoist.ObjectId(request.params.id)));
            let productToDelete = await db.conn.Products.findOne({ id: parseInt(request.params.id) });
            if (productToDelete) {
                user.cart.products = await db.conn.Products.findOne({ id: parseInt(request.params.id) });
                user.cart = recalculateCart(user.cart);
                await db.conn.Users.save(user);

                status = true;
                message = "Deleted successfully";
            } else {
                status = false;
                message = "Product not found in cart";
            }
        } else {
            status = false;
            message = "User not found";
        }
        response.json({ status: status, message: message });
        return response;
    } catch (e) {
        response.json({ status: false, message: e.message });
    }
}

function recalculateCart(cart) {
    cart.subTotal = 0;
    cart.totalTax = 0;
    cart.totalShippingCost = 0;
    cart.totalPrice = 0;
    for (i = 0; i < cart.products.length; i++) {
        cart.subTotal += (parseFloat(cart.products[i].price) * cart.products[i].qty);
        cart.totalTax += (parseFloat(cart.products[i].tax) * cart.products[i].qty);
        cart.totalShippingCost += (parseFloat(cart.products[i].shippingCost) * cart.products[i].qty);
        cart.totalPrice += (cart.subTotal + cart.totalTax + cart.totalShippingCost);
    }
    return cart;
}


//CART GET ALL CART PRODUCTS
module.exports.getAll = async function (request, response) {
    try {
        let status = false;
        let message = "";
        let data = [];
        let user = await db.conn.Users.findOne({ _id: mongoist.ObjectId(request.session.user) });

        if (user) {
            if (user.cart.products.length > 0) {
                data.push(user.cart);
                status = true;
                message = "retrieved all successfully";
                console.log(user.cart.products);
            } else {
                status = false;
                message = "Empty Cart";
                data = [];
            }
        } else {
            status = false;
            message = "User ID not found";
            data = [];
        }
        response.json({ status: status, message: message, data: data });
        return response;
    } catch (e) {
        response.json({ status: false, message: e.message });
    }
}
