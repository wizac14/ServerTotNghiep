const RatingModel = require('./RatingModel');

const createRating=async(idUser, idOder, ratingStatus, star, image,video) =>{
    try {
        const newRating = new RatingModel({
            idUser: idUser,
            idOder: idOder,
            ratingStatus: ratingStatus,
            star: star,
            image: image,
            video: video
        });
        const savedRating = await newRating.save();
        return savedRating;
    } catch (error) {
        throw new Error('Could not create rating');
    }
}
const getRatingsByOrderId = async (orderId) => {
    try {
      const ratings = await RatingModel.find({ idOder: orderId }).populate('idUser'); // Tìm các đánh giá có idOder trùng với orderId và populate thông tin user
      return ratings;
    } catch (error) {
      throw new Error('Error while fetching ratings by order id');
    }
  };

module.exports = { createRating ,getRatingsByOrderId};