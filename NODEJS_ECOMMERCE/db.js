//databaseconnection
const mongoist  =   require('mongoist');
const bcrypt    =   require('bcryptjs');
const conn =        mongoist('mongodb://localhost:27017/shopping', {useUnifiedTopology: true }, { useNewUrlParser: true});

//db collection names
const products = "Products";
const users = "Users";
const orders = "Orders";

//export the db connnection so that other files can use it as well
module.exports.conn = conn;

//initialize database

module.exports.init = async function () {
    try {
      //create the collection if it does not exist
      let collections = await conn.getCollectionNames();
  
      let collection = collections.find(q => q == users);
      if (!collection) {
        await conn.createCollection(users);
        await conn.Users.insert(user1);
        await conn.Users.insert(user2);
        await conn.Users.insert(user3);
        await conn.Users.insert(user4);
      }

      collection = collections.find(q => q == products);
      if (!collection) {
        await conn.createCollection(products);
        await conn.Products.insert(product1);
        await conn.Products.insert(product2);
        await conn.Products.insert(product3);
        await conn.Products.insert(product4);
        await conn.Products.insert(product5)
      }
  
      collection = collections.find(q => q == orders);
      if (!collection) {
        await conn.createCollection(orders);
      }
    } catch (err) {
      console.log(err);
    }
  }
  
  var product1 = {
    id: 1,
    name : "Beats by Dr. Dre Powerbeats Pro",
    description : "Transform the way you work out with Powerbeats Pro wireless headphones from Beats by Dr. Dre. These headphones deliver music straight into your ears without the hassle of cords, and they offer up to 9 hours of listening time on a single charge. Best of all, the reinforced design helps them to stay put and resist damage from sweat and water.",
    imagePath : 'https://i5.walmartimages.com/asr/58447d00-8253-4baa-8a6b-dc089ae20ea1_1.b16a46a39ba88cb8ac56909313138590.jpeg?odnWidth=undefined&odnHeight=undefined&odnBg=ffffff',
    price : 149,
    tax : (149 * 0.13),
    shippingCost : (10),
    comments : [
        {
            rating: 5,
            comment: "Good Quality! Awesome Purchase",
            imagePath : "",
            productID : 1,
            userId : 1
        }
    ]
  };
  
  
  var product2 = {
    id: 2,
    name : "Long Boots",
    description : "Split leather. || Rubber TPR outsole sole. || Shaft measures approximately 7\' from arch.",
    imagePath : "https://www.dhresource.com/0x0/f2/albu/g1/M01/7E/24/rBVaGFn55XWAY0GzAAoPq6wF7lI454.jpg",
    price : 95.99,
    tax : (95.99 * 0.13),
    shippingCost : (10),
    comments : [
        {
            rating: 4,
            comment: "too good",
            imagePath : "",
            productID : 2,
            userId : 3
        }
    ]
  };
  
  
  var product3 = {
    id: 3,
    name : "Butterfly Purse",
    description : "Material: Faux Leather. || It looks elegant and chic, the best gift for women. || Strap Length(Adjustable): 120cm/47.24in (Approx.) || Width: 24cm/9.45in, Height: 18cm/7.09in, Thickness: 11cm/4.33in (Approx.)",
    imagePath : "https://www.whatonearthcatalog.com/graphics/products/large/LG2407.jpg",
    price : 199,
    tax : (199 * 0.13),
    shippingCost : (10),
    comments : [
        {
            rating: 4,
            comment: "Costly but Good product.",
            imagePath : "",
            productID : 3,
            userId : 3
        }
    ]
  };
  
  
  var product4 = {
    id: 4,
    name : "Notebook Lenovo Ideapad 320 Intel® Core i5-7200u 8GB",
    description : "AMD A12-9720P 2.7GHz processor with turbo up to 3.3GHz.8GB DDR4 SDRAM expandable to 16GB, 1TB 5400 RPM Hard Drive.1 USB Type-C, 2 USB 3.0, 1 HDMI, Webcam, DVD-RW Drive, Bluetooth.1366 x 768 15.6-in HD widescreen LED. Winodws 10 64-bit, up to 5 hours battery life.Weighs 4.85 lbs. and measures 0.9 thin.",
    imagePath : 'https://www.pontofrio-imagens.com.br/Informatica/Notebook/11654834/850060922/notebook-lenovo-core-i5-7200u-8gb-1tb-tela-15-6-windows-10-ideapad-320-11654834.jpg',
    price : 1002,
    tax : (1002 * 0.13),
    shippingCost : (10),
    comments : [
        {
            rating: 1,
            comment: "Bad Product absolutely hate it.",
            imagePath : "",
            productID : 4,
            userId : 1
        },
        {
            rating: 3,
            comment: "Ok Ok.",
            imagePath : "",
            productID : 4,
            userId : 1
        }
    ]
  };
  
  var product5 = {
    id: 5,
    description : "15\' 1920x1080 Full HD touch screen for hands-on control. || 7th Gen(Newest) Intel Core i7-7500U mobile processor. || 16GB DDR4 memory; 256GB SSD; AMD Radeon 540 2GB. || Built-in S Pen; HD Webcam; 1x USB Type-C; 2x USB 3.0; HDMI; MicroSD. || Backlit Keyboard; 360° flip-and-fold rotating display.",
    name : "Samsung - Notebook 9 Pro - 15” Touch-Screen Laptop – Intel Core i7 – 16GB Memory – AMD Radeon 540 – 256GB Solid State Drive - Titan Silve",
    imagePath : "https://www.pontofrio-imagens.com.br/Informatica/Notebook/5701254/230262525/notebook-samsung-dual-core-4gb-500gb-tela-14-windows-10-essentials-e21-370e4k-kwa-5701254.jpg",
    price : 49.99,
    tax : (49.99 * 0.13),
    shippingCost : (10),
    comments : [
        {
            rating: 1,
            comment: "Bad Product absolutely hate it.",
            imagePath : "",
            productID : 5,
            userId : 1
        },
        {
            rating: 3,
            comment: "Ok Ok.",
            imagePath : "",
            productID : 5,
            userId : 1
        }
    ]
  };
  
  
  var user1 = {
      id : 1,
      firstName : "Aparna",
      lastName : "Tomar",
      email : "aparna91@gmail.com",
      phone : "2269003786",
      password : bcrypt.hashSync("abc",bcrypt.genSaltSync()),
      defaultAddressId : 1,
      address : [
          {
            id : 1,
            address1 : "334 Lester Street",
            address2 : "Unit 106",
            postal : "N2G 3L6",
            city : "Waterloo",
            province : "ON",
            country : "Canada"
          }
      ]
  };
  
  var user2 = {
    id : 2,
    firstName : "Chaitanya",
    lastName : "Uttarwar",
    email : "cuttarwar@gmail.com",
    phone : "5003336319",
    password : bcrypt.hashSync("abc",bcrypt.genSaltSync()),
    defaultAddressId : 1,
    addresses : [
        {
          id : 1,
          address1 : "522 Willow St.",
          address2 : "",
          postal : "N2K 0Z8",
          city : "Waterloo",
          province : "ON",
          country : "Canada"
        }
    ]
  };
  
  var user3 = {
    id : 3,
    firstName : "Zeefa",
    lastName : "Karim",
    email : "zkarim@gmail.com",
    phone : "2200022547",
    password : bcrypt.hashSync("abc",bcrypt.genSaltSync()),
    defaultAddressId : 1,
    addresses : [
        {
          id : 1,
          address1 : "100 King St.",
          address2 : "North",
          postal : "N2J 4G3",
          city : "Waterloo",
          province : "ON",
          country : "Canada"
        }
    ]
  };
  
  
  var user4 = {
    id : 4,
    firstName : "Saim",
    lastName : "Ahmed",
    email : "sahmed@gmail.com",
    phone : "2269300123",
    password : bcrypt.hashSync("abc",bcrypt.genSaltSync()),
    defaultAddressId : 1,
    addresses : [
        {
          id : 1,
          address1 : "1000 Queen St.",
          address2 : "North",
          postal : "N2J 4G3",
          city : "Waterloo",
          province : "ON",
          country : "Canada"
        }
    ]
  };
  