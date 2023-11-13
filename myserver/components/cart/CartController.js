const CartService = require('./CartService');
const addNewCart = async (idUser, idRecipe, color, size, quantity) => {
  try {
    return await CartService.addNewCart(idUser, idRecipe, color, size, quantity);
  } catch (error) {
    return false;
  }
};

const getCartByIdUser = async (idUser) => {
  try {
    return await CartService.getCartIdUser(idUser);
  } catch (error) {
    return null;
  }
};

const removeProductFromCart = async (productId) => {
  try {
    return await CartService.removeProductFromCart(productId);
  } catch (error) {
    throw error;
  }
};
module.exports = {
  getCartByIdUser,
  addNewCart,
  removeProductFromCart,
};
