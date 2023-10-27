const ProductService = require('./ProductService');

const getAllProducts = async () => {
  try {
    return await ProductService.getAllProducts();
  } catch (error) {
    throw error;
  }
};
const getProductById = async (id) => {
  try {
    return await ProductService.getProductById(id);
  } catch (error) {
    return null;
  }
};

const getProductByBrandName = async (brandName) => {
  try {
    return await ProductService.getProductByBrandName(brandName);
  } catch (error) {
    return null;
  }
};

const deleteProductById = async (id) => {
  try {
    return await ProductService.deleteProductById(id);
  } catch (error) {
    throw error;
  }
};

const addNewProduct = async (product) => {
  try {
    return await ProductService.addNewProduct(product);
  } catch (error) {
    return false;
  }
};
const updateProductById = async (id, updateProduct) => {
  try {
    return await ProductService.updateProductById(id, updateProduct);
  } catch (error) {
    console.log(error);
    return false;
  }
};

const searchProduct = async (title , price, size , color) => {
    try {
        return await ProductService.searchProduct(title , price, size , color);
    } catch (error) {
        throw error;
    }
}



module.exports = { getAllProducts,getProductById, deleteProductById, addNewProduct ,updateProductById, searchProduct}
