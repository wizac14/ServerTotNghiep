const BrandModel = require('./BrandModel');

const getAllBrands = async () => {
    try {
        // Sử dụng Mongoose để tìm tất cả các tài liệu thương hiệu
        const brands = await BrandModel.find();

        return brands;
    } catch (error) {
        console.log('Lỗi khi lấy tất cả thương hiệu:', error);
        throw error;
    }
}

module.exports = {getAllBrands}