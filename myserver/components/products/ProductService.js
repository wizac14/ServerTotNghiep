
const ProductModel = require('./ProductModel');

const getAllProducts = async () => {
    try {
        return await ProductModel.find().populate('brand', '');
      } catch (error) {
        console.log('Get all products error', error);
        throw error;
      }
}
const getProductById = async (id) => {
    try {
      return await ProductModel.findById(id).populate('brand', '');
  
    } catch (error) {
      console.log('Get products by id error', error);
      return null;
    }
  }
const deleteProductById = async (id) => {
    try {
        await ProductModel.findByIdAndDelete(id);
        return true;
      } catch (error) {
        console.log('Delete products by id error', error);
        return false;
      }

}
const addNewProduct = async (title, price, discount, size, color, quantity, image, description, brand) => {
    try {
        const newProduct = { title, price, discount, size, color, quantity, image, description, brand }
        const p = new ProductModel(newProduct);
        await p.save();
        return true;
    } catch (error) {
        console.log('Add new product error:', error);
        return false;
    }
}
const updateProductById = async (id, title, price, discount, size, color, quantity, image, description, brand) => {
    try {
   

      const item = await ProductModel.findById(id);
      if (item) {
        item.title = title ? title : item.title;
        item.price = price ? price : item.price;
        item.discount = discount ? discount : item.discount;
        item.size = size ? size : item.size;
        item.color = color ? color : item.color; 
        item.quantity = quantity ? quantity : item.quantity;
        item.image = image ? image : item.image;
        item.description = description ? description : item.description;
        item.brand = brand ? brand : item.brand;
        await item.save();
        return true;
      }
      return false;
    } catch (error) {
      console.log("Update product by id error: ", error);
      return false;
    }
  };
  //tiemkiem san pham theo ten
 const filterProductByBrand=async(brand)=>{
  try {
    return await ProductModel.find({brand}
  // // lowsn hon 10
  //   // quantity:{$gt:1000} 
  //   // so luong nho hon 5 hoac so luong lon hon 50
  //   $or:[{quantity:{ $lt:5}},{quantity:{ $gt:50}}]
  //    ,
  //      // gia tien trong khoan tu 10 den 100
  //   price:{$gte:10,$lte:100}
);
    
    
  } catch (error) {
    console.log("finr product by id error: ",error);
  }
 }
  


module.exports = { getAllProducts,getProductById, deleteProductById, addNewProduct, updateProductById,filterProductByBrand}

var data = [{
    "_id": 1,
    "title": "Luettgen LLC",
    "price": 86,
    "discount": 64,
    "image": "https://authentic-shoes.com/wp-content/uploads/2023/04/561591_01.jpg_94aa5ec86a534137bb641b39ef827892.png",
    "quantity": 21,
    "brand": 2
}, {
    "_id": 2,
    "title": "Stroman Inc",
    "price": 27,
    "discount": 4,
    "image": "https://authentic-shoes.com/wp-content/uploads/2023/04/561591_01.jpg_94aa5ec86a534137bb641b39ef827892.png",
    "quantity": 54,
    "brand": 1
}, {
    "_id": 3,
    "title": "Osinski, Bergnaum and Greenfelder",
    "price": 57,
    "discount": 63,
    "image": "https://authentic-shoes.com/wp-content/uploads/2023/04/561591_01.jpg_94aa5ec86a534137bb641b39ef827892.png",
    "quantity": 5,
    "brand": 2
}, {
    "_id": 4,
    "title": "Stoltenberg-Stoltenberg",
    "price": 32,
    "discount": 86,
    "image": "https://authentic-shoes.com/wp-content/uploads/2023/04/561591_01.jpg_94aa5ec86a534137bb641b39ef827892.png",
    "quantity": 90,
    "brand": 5
}, {
    "_id": 5,
    "title": "Jast Group",
    "price": 81,
    "discount": 79,
    "image": "https://authentic-shoes.com/wp-content/uploads/2023/04/561591_01.jpg_94aa5ec86a534137bb641b39ef827892.png",
    "quantity": 99,
    "brand": 5
}, {
    "_id": 6,
    "title": "Kris-Veum",
    "price": 97,
    "discount": 60,
    "image": "https://authentic-shoes.com/wp-content/uploads/2023/04/561591_01.jpg_94aa5ec86a534137bb641b39ef827892.png",
    "quantity": 24,
    "brand": 4
}, {
    "_id": 7,
    "title": "Nicolas Inc",
    "price": 26,
    "discount": 78,
    "image": "https://authentic-shoes.com/wp-content/uploads/2023/04/561591_01.jpg_94aa5ec86a534137bb641b39ef827892.png",
    "quantity": 9,
    "brand": 4
}, {
    "_id": 8,
    "title": "Wunsch, Jacobs and Pacocha",
    "price": 10,
    "discount": 15,
    "image": "https://authentic-shoes.com/wp-content/uploads/2023/04/561591_01.jpg_94aa5ec86a534137bb641b39ef827892.png",
    "quantity": 85,
    "brand": 5
}, {
    "_id": 9,
    "title": "Anderson, Runolfsson and Sanford",
    "price": 28,
    "discount": 99,
    "image": "https://authentic-shoes.com/wp-content/uploads/2023/04/561591_01.jpg_94aa5ec86a534137bb641b39ef827892.png",
    "quantity": 40,
    "brand": 5
}, {
    "_id": 10,
    "title": "Swaniawski-Wisoky",
    "price": 15,
    "discount": 25,
    "image": "https://authentic-shoes.com/wp-content/uploads/2023/04/561591_01.jpg_94aa5ec86a534137bb641b39ef827892.png",
    "quantity": 15,
    "brand": 5
}]
