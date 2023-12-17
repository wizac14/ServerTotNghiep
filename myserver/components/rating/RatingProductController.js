const RatingPRoductService = require('./RatingProductService');

const getRatingById = async (productId) => {
  try {
    return await RatingPRoductService.getRatingsByProductId(productId);
  } catch (error) {
    return null;
  }
};
const getRatingByStar = async (idProduct, star) => {
  try {
    return await RatingPRoductService.getRatingsByProductStar(idProduct, star);
  } catch (error) {
    return null;
  }
};
const updateCountHeartsController = async (req, res) => {
  try {
    const { id, action, idUser } = req.body; // Lấy cả idUser từ request body
    const updatedRating = await RatingPRoductService.updateCountHearts(id, action, idUser);
    if (updatedRating) {
      res.status(200).json({ result: true, updatedRating: updatedRating });
    } else {
      res.status(500).json({ error: 'Failed to update countHearts' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createRaingPRoduct = async (
  idUser,
  idOder,
  idProduct,
  ratingStatus,
  star,
  image,
  video,
  israting
) => {
  try {
    return await RatingPRoductService.createRatingProduct(
      idUser,
      idOder,
      idProduct,
      ratingStatus,
      star,
      image,
      video,
      israting
    );
  } catch (error) {
    throw error;
  }
};

module.exports = {
  createRaingPRoduct,
  getRatingById,
  getRatingByStar,
  updateCountHeartsController,
};
