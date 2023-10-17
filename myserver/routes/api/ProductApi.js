const express = require('express');
const router = express.Router();
const ProductController = require('../../components/products/ProductController');
const UploadFile = require('../../middle/UploadFile');

// http://localhost:3000/api/product/get-all
// api get all product
router.get('/get-all', [], async (req, res, next) => {
    try {
        const products = await ProductController.getAllProducts();
        return res.status(200).json({ result: true, products: products });
    } catch (error) {
        console.log("Get all error: ", error);
        return res.status(500).json({ result: false, products: null });
    }
});

// http://localhost:3000/api/product/get-by-id?id=
// api get product by id
router.get('/get-by-id', async (req, res, next) => {
    try {
        const { id } = req.query;
        const product = await ProductController.getProductById(id);
        return res.status(200).json({ result: true, product: product });
    } catch (error) {
        console.log("Get by id error: ", error);
        return res.status(500).json({ result: false, product: null });
    }
});
// http://localhost:3000/api/product/delete-by-id/:id
router.delete('/delete-by-id/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const products = await ProductController.deleteProductById(id);
        return res.status(200).json({ result: true, products: products });

    } catch (error) {
        return res.status(500).json({ result: false, products: null });
    }
});
// http://localhost:3000/api/product/add-new
// api 
router.post('/add-new', [UploadFile.single('image')], async (req, res, next) => {
    try {
        let { file, body } = req;
        if (file) {
            file = `http://192.168.1.3:3000/images/${file.filename}`;
            body = { ...body, image: file };
        }
        const { title, price, discount, size, color, quantity, image, description, brand } = body;
        const product = await ProductController.addNewProduct(title, price, discount, size, color, quantity, image, description, brand);
        return res.status(200).json({ result: true, product: product });
    } catch (error) {
        console.log("Add new product error: ", error);
        return res.status(500).json({ result: false, product: null });
    }
});


// http://localhost:3000/api/product/edit-new/:id
// api 
router.post('/edit-new/:id', [UploadFile.single('image')], async (req, res, next) => {
    try {
        let { file, body } = req;
        let { id } = req.params;
        if (file) {
            file = `http://192.168.1.3:3000/images/${file.filename}`;
            body = { ...body, image: file };
        }
        const { title, price, discount, size, color, quantity, image, description, brand } = body;
        const product = await ProductController.updateProductById(id, title, price, discount, size, color, quantity, image, description, brand);
        return res.status(200).json({ result: true, product: product });
    } catch (error) {
        console.log("Edit new product error: ", error);
        return res.status(500).json({ result: false, product: null });
    }
});
// http://localhost:3000/api/product/upload-image
// upload 1 ảnh
router.post('/upload-image', [UploadFile.single('image')], async (req, res, next) => {
    try {
        const { file } = req;
        if (file) {
            const link = `http://192.168.1.3:3000/images/${file.filename}`;
            return res.status(200).json({ result: true, link: link });
        }

        return res.status(400).json({ result: true, link: null });
    } catch (error) {
        console.log("Edit new product error: ", error);
        return res.status(500).json({ result: false });
    }
});

// http://localhost:3000/api/product/upload-images
// upload nhiều ảnh
router.post('/upload-images', [UploadFile.array('image', 2)], async (req, res, next) => {
    try {
        const { files } = req;
        if (files && files.length > 0) {
            const links = [];
            for (let index = 0; index < files.length; index++) {
                const element = files[index];
                links.push = `http://192.168.1.3:3000/images/${element.filename}`;
            }

            return res.status(200).json({ result: true, links: links });
        }
        return res.status(400).json({ result: true, links: null });
    } catch (error) {
        console.log("Upload image error: ", error);
        return res.status(500).json({ result: false });
    }
});

module.exports = router;