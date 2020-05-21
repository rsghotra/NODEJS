const express = require('express');
const router = express.Router();
const cartController = require('../controllers/CartController');

//**************CART***********************/

//CART - ADD PRODUCT
router.post('/add', function(req, res) {
    cartController.add(req, res);
});

//CART - GET CART ALL PRODUCTS
router.get('/all', function(req, res) {
    cartController.getAll(req, res);
});

//CART - DELETE PRODUCT
router.delete('/remove/:id', function(req, res) {
    cartController.delete(req, res);
});

module.exports = router;