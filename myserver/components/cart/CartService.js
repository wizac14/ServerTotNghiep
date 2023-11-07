const CartModel = require('./CartModel');

const getCartIdUser = async (idUser) => {
  try {
    const cart = await CartModel.find({ idUser: idUser }, '')
      .populate('idUser', 'email name')
      .populate('idProduct', '');
    if (cart != []) {
      return cart;
    } else {
      return false;
    }
  } catch (error) {
    console.log('Get product by id error ' + error);
    return null;
  }
};

const addNewCart = async (idUser, idProduct, color, size, quantity) => {
  try {
    const cart = await CartModel.findOne({
      idUser: idUser,
      idProduct: idProduct,
      color: color,
      size: size,
      quantity: quantity,
    });
    if (cart) {
      return false; // Cart đã tồn tại
    } else {
      const newCart = { idUser, idProduct, color, size, quantity };
      const cartInstance = new CartModel(newCart);
      await cartInstance.save();
      return true; // Thêm mới cart thành công
    }
  } catch (error) {
    console.log('Lỗi khi thêm mới cart: ', error);
    return false; // Thêm mới cart thất bại
  }
};

const removeProductFromCart = async (productId) => {
  try {
    const result = await CartModel.deleteOne({ _id: productId });
    return result;
  } catch (error) {
    console.log('Lỗi khi xóa sản phẩm trong cart: ', error);
    return false;
  }
};

const updateQuantity = async (quantity, id) => {
  try {
    const cart = await CartModel.findOne({ _id: id });
    if (cart) {
      cart.quantity = quantity ? quantity : cart.quantity;
      await cart.save();
      return cart;
    }
  } catch (error) {
    console.log('update Quantity  error', error);
    return false;
  }
};
module.exports = {
  getCartIdUser,
  addNewCart,
  removeProductFromCart,
  updateQuantity,
};
