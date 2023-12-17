const RatingService = require('./RatingService');

const getRatingById = async (orderId) => {
  try {
    return await RatingService.getRatingsByOrderId(orderId);
} catch (error) { 
    return null;
}
};

const createRaing = async (idUser, idOder, ratingStatus, star, image,video) => {
  try {
    return await RatingService.createRating(idUser, idOder, ratingStatus, star, image,video);
  } catch (error) {
    throw error;
  }
};



module.exports = { createRaing,getRatingById };
