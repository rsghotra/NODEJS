const bcrypt = require("bcryptjs");
const mongoist = require('mongoist');
const db = require("../db.js");

module.exports.login = async function (request, response) {
    try {
        let status = false;
        let message = '';
        let user = await db.conn.Users.findOne({ email: request.body.email });

        if (user) {
            if (bcrypt.compareSync(request.body.password, user.password)) {
                status = true;
                message = "login successfully";
                request.session.user = user._id.toString();
            } else
                message = "Password does not match";
        } else
            message = "Email does not match";

        response.json({ status: status, message: message });
        return response;
    } catch (e) {
        response.json({ status: false, message: e.message });
    }
};

module.exports.signup = async function (request, response) {
    try {
        let status = false;
        let message = '';
        let user = request.body;
        
        //validation
        if (user.hasOwnProperty('firstName') && user.firstName !== "" &&
            user.hasOwnProperty('lastName') && user.lastName !== "" &&
            user.hasOwnProperty('email') && user.email !== "" &&
            user.hasOwnProperty('phone') && user.phone !== "" &&
          //  user.hasOwnProperty('DOB') && user.DOB !== "" &&
            user.hasOwnProperty('password') && user.password !== "") {

            if (!await db.conn.Users.findOne({ email: user.email })) {
                user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync());
              //  user.isRegistered = true;
               // user.joinDate = new Date().toISOString().slice(0, 10);
                user.defaultAddressId = 0;
                user.addresses = [];
                user.cart = {
                    subTotal: 0,
                    totalTax: 0,
                    totalShippingCost: 0,
                    totalPrice: 0,
                    products: []
                };

                user = await db.conn.Users.insert(user);
                if (user) {
                    status = true;
                    message = 'account created successfully';
                    request.session.user = user._id.toString();
                } else {
                    status = false;
                    message = 'account can not be created'
                }
            } else {
                status = false;
                message = 'account already exists';
            }
        } else {
            status = false;
            message = 'One or more data is invalid';
        }
        response.json({ status: status, message: message });
    } catch (e) {
        response.json({ status: false, message: e.message });
    }
}

module.exports.getAllUsers = async function (response) {
    try {
        let status = false;
        let message = '';
        let users = await db.conn.Users.find({});
        response.json({ status: true, message: 'users retrieved successfully', data: users });
    } catch (e) {
        response.json({ status: false, message: e.message });
    }
}

module.exports.getUserById = async function (request, response) {
    try {
        let status = false;
        let message = '';
        let data = [];

        if (request.session.user) {
            //var user = await db.conn.Users.findOne({ id: parseInt(request.params.id) });
            var user = await db.conn.Users.findOne({ _id: mongoist.ObjectId(request.session.user) }, { id: 0, password: 0,  _id: 0, defaultAddressId: 0 });
            console.log(user)
            if (user) {
                data.push(user);
                status = true;
                message = 'User details retrieved';
            } else {
                status = false;
                message = 'User data not found';
            }
        } else {
            status = false;
            message = 'Unauthorized access not allowed';
        }
        response.json({ status: status, message: message, data: data });
    } catch (e) {
        response.json({ status: false, message: e.message });
    }
}

module.exports.updateUser = async function (request, response) {
    try {
        let status = false;
        let message = '';
        var updatedUser = request.body;

        if (request.session.user) {
            if ((updatedUser.hasOwnProperty('firstName') && updatedUser.firstName !== "") ||
                (updatedUser.hasOwnProperty('lastName') && updatedUser.lastName !== "") ||
                (updatedUser.hasOwnProperty('email') && updatedUser.email !== "") ||
                (updatedUser.hasOwnProperty('phone') && updatedUser.phone !== "") ||
               // (updatedUser.hasOwnProperty('DOB') && updatedUser.DOB !== "") ||
                (updatedUser.hasOwnProperty('password') && updatedUser.password !== "")) {
                if (updatedUser.hasOwnProperty('password')) {
                    updatedUser.password = bcrypt.hashSync(updatedUser.password, bcrypt.genSaltSync());
                }

                const userId = mongoist.ObjectId(request.session.user);
                var user = await db.conn.Users.find({ _id: userId });
                if (user && user.length > 0) {
                    const keys = Object.keys(updatedUser);

                    //get provided data and set it to user object
                    keys.forEach(key => {
                        user[0][key] = updatedUser[key];
                    });

                    //update user object in the database
                    await db.conn.Users.update({ "_id": userId }, { $set: user[0] });
                    status = true;
                    message = 'User details updated successfully';
                } else {
                    status = false;
                    message = 'User not found';
                }
            } else {
                status = false;
                message = 'One or more data is invalid';
            }
        } else {
            status = false;
            message = 'Unauthorized access not allowed';
        }
        response.json({ status: status, message: message });
    } catch (e) {
        response.json({ status: false, message: e.message });
    }
}

module.exports.deleteUser = async function (request, response) {
    try {
        let status = false;
        let message = '';
        var user = await db.conn.Users.find({ _id: mongoist.ObjectId(request.session.user) });
        if (user && user.length > 0) {
            await db.conn.Users.remove({ "_id": mongoist.ObjectId(request.session.user) }, { justOne: true });
            status = true;
            message = 'User deleted successfully';
        } else {
            status = false;
            message = 'User not found';
        }
        response.json({ status: status, message: message });
    } catch (e) {
        response.json({ status: false, message: e.message });
    }
}

module.exports.logout = async function (request, response) {
    try {
        let status = false;
        let message = '';

        if (request.session.user) {
            request.session = null;
            status = true;
            message = 'Logout successfully';
        } else {
            status = false;
            message = 'User is already logged out';
        }
        response.json({ status: status, message: message });
    } catch (e) {
        response.json({ status: false, message: e.message });
    }
}