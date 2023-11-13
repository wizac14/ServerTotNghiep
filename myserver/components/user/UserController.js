const UserModel = require('./UserModel');
const userService=require('./UserService');

const login= async (email,password)=>{
    return await userService.login(email,password);
}

const register =async(email,password,name,address,phoneNumber)=>{
    return await userService.register(email,password,name,address,phoneNumber);
}
const updateUser = async (name, email, password, address,phoneNumber, gender, dob,image) => {
    try {
        return await userService.updateUser(name, email, password, address,phoneNumber, gender, dob,image);

    } catch (error) {
        return false;
    }
}
module.exports={login,register,updateUser};