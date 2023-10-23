const BrandService=require("./BrandService");
const getAllBrand = async () => {
    try {
        return await BrandService.getBrand();
    } catch (error) {
        throw error;
    }
    
}
module.exports = { getAllBrand}