const express = require('express');
const router = express.Router();
const RatingController = require('../../components/rating/RatingController');
const uploadVideo = require('../../middle/UploadVideo');
const upload = require('../../middle/UploadImg');


//http://localhost:3000/api/rating/get-by-id?orderId=

router.get('/get-by-id', async (req, res, next) => {
  try {
    const { orderId } = req.query;
    const rating = await RatingController.getRatingById(orderId);
   if(rating)
   {
    return res.status(200).json({ result: true, rating: rating });

   }
   return res.status(400).json({ result: true, rating: false });
   
  } catch (error) {
    return res.status(500).json({ result: false, rating: null });
  }
});

//http://localhost:3000/api/rating/add-new-rating
// API để thêm mới đánh giá
router.post('/add-new-rating', [upload.single('image'),uploadVideo.single('video')], async (req, res, next) => {
  try {
    let { file, body, files } = req;
    if (file) {
      file = `http://192.168.233.144:3000/images/${file.filename}`;
      body = { ...body, image: file };
    }
      if (files) {
      files = `http://192.168.233.144:3000/videos/${files.filename}`;
      body = { ...body, video: files };
    }


    const { idUser, idOrder, ratingStatus, star, image, video } = body;
    const rating = RatingController.createRaing(idUser, idOrder, ratingStatus, star, image, video);

    if (rating) {
      return res.status(200).json({ result: true, rating: true });
    }

    return res.status(400).json({ result: false, rating: null });
  } catch (error) {
    console.error("Error ratingProduct:", error);
    return res.status(500).json({ result: false, message: 'Internal server error', error });
  }
});

//http://localhost:3000/api/rating/upload-image
router.post('/upload-image', [upload.single('image')], async (req, res, next) => {
  try {
    const { file } = req;
    if (file) {
      const link = `http://192.168.233.144:3000/images/${file.filename}`;
      return res.status(200).json({ result: true, link: link })
    }
    return res.status(400).json({ result: false, link: null })
  } catch (error) {
    console.log("Failed to updaload error:" + error);
    return res.status(500).json({ result: false, massage: "Failed to rating image" })
  }
})
//http://localhost:3000/api/rating/upload-video
router.post('/upload-video', [uploadVideo.single('video')], async (req, res, next) => {
  try {
    const { file } = req;
    if (file) {
      const link = `http://192.168.233.144:3000/videos/${file.filename}`;
      return res.status(200).json({ result: true, link: link })
    }
    return res.status(400).json({ result: false, link: null })
  } catch (error) {
    console.log("Failed to updaload error:" + error);
    return res.status(500).json({ result: false, massage: "Failed to rating image" })
  }
});


//http://localhost:3000/api/rating/add
router.post('/add', upload.fields([{ name: 'image', maxCount: 1 }, { name: 'video', maxCount: 1 }]), async (req, res) => {
  try {
    const { idUser, idOrder, ratingStatus, star } = req.body;
    const image = req.files['image'] ? `http://192.168.233.144:3000/images/${req.files['image'][0].filename}` : '';
    const video = req.files['video'] ? `http://192.168.233.144:3000/videos/${req.files['video'][0].filename}` : '';


    const rating = RatingController.createRaing(idUser, idOrder, ratingStatus, star, image, video);

    if (rating) {
      return res.status(200).json({ result: true, rating: true });
    }

    return res.status(400).json({ result: false, rating: null });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
module.exports = router;
