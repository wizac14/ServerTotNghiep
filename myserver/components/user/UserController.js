const userService = require('./UserService');

const login = async (email, password) => {
  return await userService.login(email, password);
};

const register = async (email, password, name, address, phoneNumber) => {
  return await userService.register(email, password, name, address, phoneNumber);
};
const getAllUsers = async () => {
  try {
    return await userService.getAllUsers();
  } catch (error) {
    throw error;
  }
};
const getUserById = async (id) => {
  try {
    return await userService.getUserById(id);
  } catch (error) {
    return null;
  }
};
const deleteUserById = async (id) => {
  try {
    return await userService.deleteUserById(id);
  } catch (error) {
    throw false;
  }
};
const updateUser = async (id, name, email, phoneNumber, address) => {
  try {
      return await userService.updateUser(id, name, email, phoneNumber, address);
  } catch (error) {
      return false;
  }
}
module.exports = { login, register, getAllUsers, getUserById, deleteUserById, updateUser };
