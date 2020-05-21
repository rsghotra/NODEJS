const db = require("../db.js");
const mongoist = require('mongoist');
const shortId = require("shortid");

//ORDER POST ADD ORDER
module.exports.addOrder = async function (request, response) {
    try {
        let status = false;
        let message = "";
        let req = request.body;
        let user = await db.conn.Users.findOne({ _id: mongoist.ObjectId(request.session.user) });
        let address = user.addresses.filter(a => a.id == req.shippingAddressId);
        var hash = shortId.generate();

        if (user) {
            if (user.cart.products.length > 0) {
                if (address.length > 0) {
                    var order = {
                        _id: hash,
                        userId : mongoist.ObjectId(request.session.user),
                        user: user,
                        shippingAddress: address
                    };
                    await db.conn.Orders.insert(order);
                    user.cart.products = [];
                    user.cart.subTotal = 0;
                    user.cart.totalTax = 0;
                    user.cart.totalShippingCost = 0;
                    user.cart.totalPrice = 0;

                    await db.conn.Users.save(user);
                    status = true;
                    message = "Added successfully";
                } else {
                    status = false;
                    message = "No address found on profile. Please update address in your profile.";
                }
            } else {
                message = "Zero products in the cart. Please go ahead and shop!";
                status = false;
            }
        } else {
            status = false;
            message = "Please signup/signin to complete your order.";
        }
        response.json({ status: status, message: message });
        return response;
    } catch (e) {
        response.json({ status: false, message: e.message });
    }
};

//ORDER GET ALL ORDERS
module.exports.getAllOrders = async function (request, response) {
    try {
        let status = false;
        let message = "";
        let data = [];
        let orders = await db.conn.Orders.find({ userId: mongoist.ObjectId(request.session.user) });
        
        if (orders) {
            if (orders.length > 0) {
                status = true;
                message = "All orders retreived.";
                console.log(orders);
                data = orders;
            } else {
                status = false;
                message = "No order history.";
                data = [];
            }
        } else {
            status = false;
            message = "No history.";
            data = [];
        }
        response.json({ status: status, message: message, data: data });
        return response;
    } catch (e) {
        response.json({ status: false, message: e.message });
    }
}
