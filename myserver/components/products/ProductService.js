const ProductModel = require('./ProductModel');
const BrandModel = require('../brand/BrandModel');
const firebaseAdmin = require('../../utils/firebaseAdmin');

const getAllProducts = async () => {
  try {
    return await ProductModel.find().populate('brand', '');
  } catch (error) {
    console.log('Get all products error', error);
    throw error;
  }
};
const getProductById = async (id) => {
  try {
    return await ProductModel.findById(id).populate('brand', '');
  } catch (error) {
    console.log('Get products by id error', error);
    return null;
  }
};

const getProductByBrandName = async (brandName) => {
  try {
    // Tìm ID của thương hiệu dựa trên tên
    const brand = await BrandModel.findOne({ name: brandName });

    if (!brand) {
      console.log('Không tìm thấy thương hiệu.');
      return null;
    }

    // Sử dụng ID của thương hiệu để tìm sản phẩm
    return await ProductModel.find({ brand: brand._id });
  } catch (error) {
    console.log('Lỗi khi lấy sản phẩm theo thương hiệu:', error);
    return null;
  }
};

const deleteProductById = async (id) => {
  try {
    let product = await ProductModel.findOne({ _id: id });
    await product?.variances?.forEach((variance) => {
      variance?.images.forEach((image) => {
        firebaseAdmin.deleteFirebaseStorageFile(image?.name);
      });
    });

    await ProductModel.findByIdAndDelete(id);
  } catch (error) {
    console.log('Delete products by id error', error);
    return false;
  }
};
const addNewProduct = async (product) => {
  try {
    const brand = await BrandModel.findOne({ _id: product?.brandId });
    if (!brand) {
      console.log('Không tìm thấy thương hiệu.');
      return false;
    }
    const newProduct = new ProductModel({
      title: product?.title,
      price: product?.price,
      discount: product?.discount,
      description: product?.description,
      brand: brand,
      isDisabled: product?.isDisabled,
      variances: product?.variances,
    });

    await newProduct.save();
    return newProduct;
  } catch (error) {
    console.log('Add new product error:', error);
    return false;
  }
};
const updateProductById = async (id, updateProduct) => {
  try {
    let product = await ProductModel.findById(id);
    if (!product) {
      throw 'Failed to find product with id = ' + id;
    }
    const updateBrand = await BrandModel.findById(updateProduct?.brandId);
    updateProduct['brand'] = updateBrand;

    let imagesOfUpdateProduct = [];
    let imagesOfExistingProduct = [];

    await updateProduct?.variances?.forEach((variance) => {
      variance?.images.forEach((image) => {
        imagesOfUpdateProduct.push(image.name);
      });
    });

    await product?.variances?.forEach((variance) => {
      variance?.images.forEach((image) => {
        imagesOfExistingProduct.push(image.name);
      });
    });

    let deleteImages = await imagesOfExistingProduct?.filter(
      (imageName) => !imagesOfUpdateProduct.includes(imageName)
    );
    deleteImages.forEach((imageName) => firebaseAdmin.deleteFirebaseStorageFile(imageName));
    await ProductModel.updateOne({ _id: id }, updateProduct);
    product = await ProductModel.findById(id);
    return product;
  } catch (error) {
    console.log('Update product by id error: ', error);
    return false;
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  deleteProductById,
  addNewProduct,
  updateProductById,
  getProductByBrandName,
};

var data = [
  {
    _id: 1,
    title: 'Luettgen LLC',
    price: 86,
    discount: 64,
    image:
      'https://authentic-shoes.com/wp-content/uploads/2023/04/561591_01.jpg_94aa5ec86a534137bb641b39ef827892.png',
    quantity: 21,
    brand: 2,
  },
  {
    _id: 2,
    title: 'Stroman Inc',
    price: 27,
    discount: 4,
    image:
      'https://authentic-shoes.com/wp-content/uploads/2023/04/561591_01.jpg_94aa5ec86a534137bb641b39ef827892.png',
    quantity: 54,
    brand: 1,
  },
  {
    _id: 3,
    title: 'Osinski, Bergnaum and Greenfelder',
    price: 57,
    discount: 63,
    image:
      'https://authentic-shoes.com/wp-content/uploads/2023/04/561591_01.jpg_94aa5ec86a534137bb641b39ef827892.png',
    quantity: 5,
    brand: 2,
  },
  {
    _id: 4,
    title: 'Stoltenberg-Stoltenberg',
    price: 32,
    discount: 86,
    image:
      'https://authentic-shoes.com/wp-content/uploads/2023/04/561591_01.jpg_94aa5ec86a534137bb641b39ef827892.png',
    quantity: 90,
    brand: 5,
  },
  {
    _id: 5,
    title: 'Jast Group',
    price: 81,
    discount: 79,
    image:
      'https://authentic-shoes.com/wp-content/uploads/2023/04/561591_01.jpg_94aa5ec86a534137bb641b39ef827892.png',
    quantity: 99,
    brand: 5,
  },
  {
    _id: 6,
    title: 'Kris-Veum',
    price: 97,
    discount: 60,
    image:
      'https://authentic-shoes.com/wp-content/uploads/2023/04/561591_01.jpg_94aa5ec86a534137bb641b39ef827892.png',
    quantity: 24,
    brand: 4,
  },
  {
    _id: 7,
    title: 'Nicolas Inc',
    price: 26,
    discount: 78,
    image:
      'https://authentic-shoes.com/wp-content/uploads/2023/04/561591_01.jpg_94aa5ec86a534137bb641b39ef827892.png',
    quantity: 9,
    brand: 4,
  },
  {
    _id: 8,
    title: 'Wunsch, Jacobs and Pacocha',
    price: 10,
    discount: 15,
    image:
      'https://authentic-shoes.com/wp-content/uploads/2023/04/561591_01.jpg_94aa5ec86a534137bb641b39ef827892.png',
    quantity: 85,
    brand: 5,
  },
  {
    _id: 9,
    title: 'Anderson, Runolfsson and Sanford',
    price: 28,
    discount: 99,
    image:
      'https://authentic-shoes.com/wp-content/uploads/2023/04/561591_01.jpg_94aa5ec86a534137bb641b39ef827892.png',
    quantity: 40,
    brand: 5,
  },
  {
    _id: 10,
    title: 'Swaniawski-Wisoky',
    price: 15,
    discount: 25,
    image:
      'https://authentic-shoes.com/wp-content/uploads/2023/04/561591_01.jpg_94aa5ec86a534137bb641b39ef827892.png',
    quantity: 15,
    brand: 5,
  },
];
