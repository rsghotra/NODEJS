const mongoist = require('mongoist');
const db = require("../db.js");
const shortId = require('shortid');

module.exports.getAllComments = async function (request, response) {
    try {
        let status = false;
        let message = '';
        let comments = [];
        if (request.session.user) {
            let product = await db.conn.Products.findOne({ id: parseInt(request.params.id) });
            if (product) {
                comments = product.comments;
                console.log(comments);
                status = true;
                message = 'Retrieved comments.';
            } else {
                status = false;
                message = 'No product found.';
            }
        } else {
            status = false;
            message = 'No User loggedin';
        }
        response.json({ status: status, message: message, data: comments });
    } catch (e) {
        response.json({ status: false, message: e.message });
    }
}

module.exports.addComments = async function (request, response) {
    try {
        let status = false;
        let message = '';
        if (request.session.user) {
            let comment = request.body;

            if (comment.hasOwnProperty('rating') && comment.rating !== '' &&
                comment.hasOwnProperty('comment') &&
                comment.hasOwnProperty('productid') && comment.productid !== '') {
                let product = await db.conn.Products.findOne({ id: parseInt(comment.productid) });    
                if (product) 
                {
                    let randomFileName = shortId.generate();
                    comment.imagePath = comment.imagePath;
                    comment.userId = request.session.user;
                    comment.id = randomFileName;

                    product.comments.push(comment);
                    await db.conn.Products.save(product);

                    status = true;
                    message = 'Comment Added';
                } else {
                    status = false;
                    message = 'Product not found.';
                }
            } else {
                status = false;
                message = 'Invalid Paramters';
            }
        } else {
            status = false;
            message = 'No User logged in.';
        }
        response.json({ status: status, message: message });
    } catch (e) {
        response.json({ status: false, message: e.message });
    }
}