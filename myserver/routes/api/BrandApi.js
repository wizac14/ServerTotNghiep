const express = require('express');
const router = express.Router();
const BrandController = require('../../components/brand/BrandController');
// http://localhost:3000/api/brand/get-all
// api get all brand
router.get('/get-all', [], async (req, res, next) => {
    try {
        const brands = await BrandController.getAllBrand();
        return res.status(200).json({ result: true, brands: brands });
    } catch (error) {
        console.log("Get all error: ", error);
        return res.status(500).json({ result: false, brands: null });
    }
});

module.exports = router;