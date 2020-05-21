const express = require('express');
const router = express.Router();
const addressController = require('../controllers/AddressController');

//***********ADDRESS***********/
//ADDRESS POST ADDRESS
router.post('/add', function(req, res) {
    addressController.add(req, res);
});

//ADDRESS - PUT ADDRESS UPDATE
router.put('/update/:id', function(req, res) {
    addressController.update(req, res);
});

//ADDRESS - GET ALL ADDRESS
router.get('/:id', function (req, res) {
    addressController.getAddress(req, res);
});

//ADDRESS - DELETE ADDRESS
router.delete('/remove/:id', function (req, res) {
    addressController.delete(req, res);
});

module.exports = router;