const express = require('express');
const router = express.Router();
const BrandController = require('../../components/brand/BrandController')

// http://localhost:3000/api/brand/get-all-brands
// api get all brands
router.get('/get-all-brands', async (req, res) => {
    try {
        const brands = await BrandController.getAllBrands();
        res.status(200).json({ result: true, brands: brands });
    } catch (error) {
        console.error('Lỗi khi lấy tất cả thương hiệu:', error);
        res.status(500).json({ result: false, brands: null });
    }
});

module.exports = router;