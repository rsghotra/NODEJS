const db = require("../db");
const fs = require('fs');

const TAX = 0.13;
const SHIPPING_MARKUP = 10;

//PRODUCT GET ONE PRODUCT
module.exports.getProductById = async function (request, response) {
    try {
        let status = false;
        let message = "";
        let data = [];

        if (request.params.id) {
            let product = await db.conn.Products.findOne({ id: parseInt(request.params.id) });
            if (product) {
                status = true;
                message = "Product Found!";
                data.push(product);
            } else {
                status = false;
                message = "No product found.";
            }
        } else {
            status = false;
            message = "Product not found.";
        }
        response.json({ status: status, message: message, data: data });
        return response;
    } catch (e) {
        response.json({ status: false, message: e.message });
    }
};

//PRODUCT GET ALL PRODUCTS
module.exports.getProducts = async function (request, response) {
    try {
        let status = false;
        let message = "";
        let data = [];
        let products = await db.conn.Products.find({});

        if (products.length > 0) {
            status = true;
            message = "All Product Found";
            console.log(products);
            data = products;

        } else {
            status = false;
            message = "No products in KW market.";
            data = [];
        }
        response.json({ status: status, message: message, data: data });
        return response;
    } catch (e) {
        response.json({ status: false, message: e.message });
    }
};

function isEmpty(value) {
    return typeof value == 'string' && !value.trim() || typeof value == 'undefined' || value === null;
}
