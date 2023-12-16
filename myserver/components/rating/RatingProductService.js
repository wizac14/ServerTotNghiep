const RatingProductModel = require('./RatingProductModel');

const createRatingProduct=async(idUser, idOder, idProduct,ratingStatus, star, image,video,israting) =>{
    try {
        const newRating = new RatingProductModel({
            idUser: idUser,
            idOder: idOder,
            idProduct: idProduct,
            ratingStatus: ratingStatus,
            star: star,
            image: image,
            video: video,
            israting :israting
        });
        const savedRating = await newRating.save();
        return savedRating;
    } catch (error) {
        throw new Error('Could not create rating');
    }
}
const getRatingsByProductId = async (productId) => {
    try {
      const ratings = await RatingProductModel.find({ idProduct: productId }).populate('idUser'); // Tìm các đánh giá có idOder trùng với orderId và populate thông tin user
      return ratings;
    } catch (error) {
      throw new Error('Error while fetching ratings by product id');
    }
  };

  const getRatingsByProductStar = async (idProduct,star) => {
    try {
      let ratings;
      if (star === "ALL") {
        ratings = await RatingProductModel.find({ idProduct: idProduct }).populate('idUser').populate('idProduct');
      } else {
        ratings = await RatingProductModel.find({ idProduct: idProduct, star: star }).populate('idUser').populate('idProduct');
      }
      return ratings;
    } catch (error) {
      throw new Error('Error while fetching ratings by product star');
    }
  };
  const updateCountHearts = async (id, action) => {
    try {
      const rating = await RatingProductModel.findById(id);
  
      if (action === 'click') {
        rating.countHearts += 1;
      } else if (action === 'unclick' && rating.countHearts > 0) {
        rating.countHearts -= 1;
      }
  
      await rating.save();
      return rating;
    } catch (error) {
      throw new Error('Error updating countHearts: ' + error.message);
    }
  };
  

module.exports = { createRatingProduct ,getRatingsByProductId,getRatingsByProductStar,updateCountHearts};