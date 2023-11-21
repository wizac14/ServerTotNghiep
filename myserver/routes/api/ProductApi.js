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
    console.log('Get all error: ', error);
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
    console.log('Get by id error: ', error);
    return res.status(500).json({ result: false, product: null });
  }
});

// http://localhost:3000/api/product/get-by-brand?brandName=
// api get product by brands
router.get('/get-by-brand', async (req, res, next) => {
  try {
    const { brandName } = req.query;
    const product = await ProductController.getProductByBrandName(brandName);
    return res.status(200).json({ result: true, products: product });
  } catch (error) {
    console.log('Get by brand error: ', error);
    return res.status(500).json({ result: false, products: null });
  }
});

// http://localhost:3000/api/product/delete-by-id/:id
router.delete('/delete/:id', async (req, res, next) => {
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
router.post('/', async (req, res, next) => {
  try {
    let { body } = req;
    const product = await ProductController.addNewProduct(body);

    return res.status(200).json({ result: true, product: product });
  } catch (error) {
    console.log('Add new product error: ', error);
    return res.status(500).json({ result: false, product: null });
  }
});

// http://localhost:3000/api/product/edit-new/:id
// api
router.put('/update/:id', async (req, res, next) => {
  try {
    let { body } = req;
    let { id } = req.params;
    const product = await ProductController.updateProductById(id, body);
    return res.status(200).json({ result: true, product: product });
  } catch (error) {
    console.log('Edit new product error: ', error);
    return res.status(500).json({ result: false, product: null });
  }
});
// http://localhost:3000/api/product/upload-image
// upload 1 ảnh
router.post('/upload-image', [UploadFile.single('image')], async (req, res, next) => {
  try {
    const { file } = req;
    if (file) {
      const link = `http://192.168.1.2:3000/images/${file.filename}`;
      return res.status(200).json({ result: true, link: link });
    }

    return res.status(400).json({ result: true, link: null });
  } catch (error) {
    console.log('Edit new product error: ', error);
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
        links.push = `http://192.168.1.2:3000/images/${element.filename}`;
      }

      return res.status(200).json({ result: true, links: links });
    }
    return res.status(400).json({ result: true, links: null });
  } catch (error) {
    console.log('Upload image error: ', error);
    return res.status(500).json({ result: false });
  }
});
// http://localhost:3000/api/product/filter-by-brand
router.get('/filter-by-brand', [], async (req, res, next) => {
    try {
        const { brand } = req.query;
        // console.log(brand)
        const recipe = await ProductController.filterProductByBrand(brand);
        if (recipe) {
            return res.status(200).json({ result: true, recipe: recipe });
        }
        return res.status(400).json({ result: false });
    } catch (error) {
        return res.status(500).json({ result: false, recipe: null });
    }
});

// http://localhost:3000/api/product/search
router.get('/search', async (req, res, next) => {
  try {
      const { title ,color} = req.query;
      const products = await ProductController.searchProduct(title , color);
      return res.status(200).json({ result: true, products: products });
  } catch (error) {
      console.log("Search product error: ", error);
      return res.status(500).json({ result: false, products: null });
  }
});    



module.exports = router;
