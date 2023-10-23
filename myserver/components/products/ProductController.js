const ProductService = require('./ProductService');

const getAllProducts = async () => {
    try {
        return await ProductService.getAllProducts();
    } catch (error) {
        throw error;
    }
    
}
const getProductById = async(id)=>{
    try {
        return await ProductService.getProductById(id);
    } catch (error) { 
        return null;
    }
}

const deleteProductById = async (id) => {
    try {
        return await ProductService.deleteProductById(id);
    } catch (error) {
        throw error;
    }
   
}

const addNewProduct = async(title, price,discount,size,color, quantity, image, description, brand)=>{
    try {
        return await ProductService.addNewProduct(title, price,discount,size,color, quantity, image, description, brand);
    } catch (error) {
        return false;
    }
}
const updateProductById = async(id,title, price,discount,size,color, quantity, image, description, brand)=>{
    try {
        return await ProductService.updateProductById(id,title, price,discount,size,color, quantity, image, description, brand);
    } catch (error) {
        console.log(error);
        return false;
    }
}
const filterProductByBrand=async(brand)=>{
    try {
        return await ProductService.filterProductByBrand(brand);
    } catch (error) {
        console.log("filter by brand error",error);
    }
    return null;
}




module.exports = { getAllProducts,getProductById, deleteProductById, addNewProduct ,updateProductById,filterProductByBrand}