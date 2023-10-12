const userService=require('./UserService');

const login= async (email,password)=>{
    return await userService.login(email,password);
}

const register =async(email,password,name,address,phoneNumber)=>{
    return await userService.register(email,password,name,address,phoneNumber);
}
module.exports={login,register};