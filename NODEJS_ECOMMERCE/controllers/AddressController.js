const db = require("../db.js");
const mongoist = require('mongoist');

//ADDRESS POST ADD ADDRESS
module.exports.add = async function (request, response) {
    try {
        var status = false;
        var message = "";
        var user = await db.conn.Users.findOne({ _id: mongoist.ObjectId(request.session.user) });
        var address = request.body;

        //validation
        if (address.hasOwnProperty('address1') && !isEmpty(address.address1) &&
            address.hasOwnProperty('postal') && !isEmpty(address.postal) &&
            address.hasOwnProperty('city') && !isEmpty(address.city) &&
            address.hasOwnProperty('province') && !isEmpty(address.province) &&
            address.hasOwnProperty('country') && !isEmpty(address.country)) {
            if (user) {
                var address = {
                    id: address.id,
                    address1: address.address1,
                    address2: isEmpty(address.address2) ? "" : address.address2,
                    postal: address.postal,
                    city: address.city,
                    province: address.province,
                    country: address.country
                };
                user.addresses.push(address);
                await db.conn.Users.save(user);
                status = true;
                message = "Added successfully";
            } else {
                status = false;
                message = "User not found";
            }
        } else {
            status = false;
            message = "Insuffient amount of data provided.";
        }
        response.json({ status: status, message: message });
    } catch (e) {
        response.json({ status: false, message: e.message });
    }
};

//ADDRESS DELETE ADDRESS
module.exports.delete = async function (request, response) {
    try {
        var status = false;
        var message = "";
        var user = await db.conn.Users.findOne({ _id: mongoist.ObjectId(request.session.user) });

        if (user && request.params.id) {
            var filteredAddresses = user.addresses.filter(a => a.id !== parseInt(request.params.id));
            if (user.addresses.length > filteredAddresses.length) {
                user.addresses = filteredAddresses;
                await db.conn.Users.save(user);
                status = true;
                message = "Address Deleted successfully";
            } else {
                status = false;
                message = "Invalid address ID";
            }
        } else {
            status = false;
            message = "User or Address ID not found";
        }
        response.json({ status: status, message: message });
    } catch (e) {
        response.json({ status: false, message: e.message });
    }
};

//ADDRESS - PUT ADDRESS UPDATE
module.exports.update = async function (request, response) {
    try {
        var status = false;
        var message = "";
        var user = await db.conn.Users.findOne({ _id: mongoist.ObjectId(request.session.user) });
        var address = request.body;

        if (address.hasOwnProperty('address1') && !isEmpty(address.address1) &&
            address.hasOwnProperty('postal') && !isEmpty(address.postal) &&
            address.hasOwnProperty('city') && !isEmpty(address.city) &&
            address.hasOwnProperty('province') && !isEmpty(address.province) &&
            address.hasOwnProperty('country') && !isEmpty(address.country)) {

            if (user) {
                var withOutAddresses = user.addresses.filter(a => a.id !== parseInt(request.params.id));
                var withAddresses = user.addresses.filter(a => a.id === parseInt(request.params.id));
                if (user.addresses.length >= withOutAddresses.length) {
                    var address = {
                        id: withAddresses[0].id,
                        address1: address.address1,
                        address2: isEmpty(address.address2) ? "" : address.address2,
                        postal: address.postal,
                        city: address.city,
                        province: address.province,
                        country: address.country
                    };
                    withOutAddresses.push(address);
                    user.addresses = withOutAddresses;
                }
                await db.conn.Users.save(user);
                status = true;
                message = "Updated successfully";
            } else {
                status = false;
                message = "User not found";
            }
        } else {
            status = false;
            message = "Insuffient amount of data provided.";
        }
        response.json({ status: status, message: message });
    } catch (e) {
        response.json({ status: false, message: e.message });
    }
};

//ADDRESS - GET ALL ADDRESSES
module.exports.getAddress = async function (request, response) {
    try {
        var status = false;
        var message = "";
        var data = [];
        var user = await db.conn.Users.findOne({ _id: mongoist.ObjectId(request.session.user) });
        if (user) {
            if (user.addresses.length > 0) {
                status = true;
                message = "retrieved all successfully";
                data = user.addresses;
            } else {
                status = false;
                message = "Invalid address ID";
                data = [];
            }
        } else {
            status = false;
            message = "User or Address ID not found";
            data = [];
        }
        response.json({ status: status, message: message, data: data });
    } catch (e) {
        response.json({ status: false, message: e.message });
    }
};

function isEmpty(value) {
    return typeof value == 'string' && !value.trim() || typeof value == 'undefined' || value === null;
}
