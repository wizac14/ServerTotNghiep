const BrandService = require('./BrandService');

const getAllBrands = async () => {
    try {
        return await BrandService.getAllBrands();
    } catch (error) {
        throw error;
    }
    
}
module.exports = { getAllBrands}
