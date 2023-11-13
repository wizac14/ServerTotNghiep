const UserModel = require('./UserModel');
const userService=require('./UserService');

const login= async (email,password)=>{
    return await userService.login(email,password);
}

const register =async(email, password, name,address,phoneNumber,isActive,role ,gender,dob, image)=>{
    return await userService.register(email, password, name,address,phoneNumber,isActive,role ,gender,dob, image);
}
const updateUser = async (id, name, email, phoneNumber, address, gender, dob, image) => {
    try {
        return await userService.updateUser(id, name, email, phoneNumber, address, gender, dob, image);
    } catch (error) {
        return false;
    }
  }
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
}
  
module.exports={login,register,updateUser, getAllUsers, getUserById, deleteUserById};