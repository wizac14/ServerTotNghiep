const UserModel = require('./UserModel');
const userModel = require('./UserModel');
const bcrypt = require('bcryptjs');
//1. kiem tra email,password
//2. kiem tra email co ton tai trong database khong
//3. kiem tra password co dung ko
//4. neu dung, tra ve thong tin user
//5. neu sai, tra ve null
const login = async (email, password) => {
    // const user=users.find(u => u.email==email);
    // if(user && user.password==password)
    // {
    //     return user;
    // }
    // return null;

    try {
        const user = await userModel.findOne({ email: email });

        if (user) {
            const result=bcrypt.compareSync(password,user.password);
            return result?user:false;
        }

    } catch (error) {
        console.log('login error: ', error);

    }
    return false;

}

const register = async (email, password, name,address,phoneNumber,isActive,role,gender,dob, image) => {
    try {
        // kiem tra email da co hnay chua
        // selec * form users where email=email
        const user = await userModel.findOne({ email: email });
        if (user) {
            console.log("Email đã được đăng kí");
            return false;
        }
        // them moi user vao data
        // ma hoa password
        var salt = bcrypt.genSaltSync(10);
        var hash = bcrypt.hashSync(password, salt);
        const newUser = { email, password:hash, name ,address,phoneNumber,isActive,role,gender,dob,image};
        const u = new userModel(newUser);
        await u.save();
        return true;


    } catch (error) {
        console('register error: ', error);

    }
    return false;

}
//// //name: { type: String },
// email: { type: String },
// password: { type: String },
// address:{type: String},
// phoneNumber:{type:Number},
// gender
// role:{type: Number,default:1},
// image: { type: String, default: "" },
const updateUser = async (id, name, email, phoneNumber, address, gender, dob, image) => {
    try {
        const user = await userModel.findById(id)
        console.log("sadad", user);
        if (user) {
            user.name = name ? name : user.name;
            user.email = email ? email : user.email;
            user.phoneNumber = phoneNumber ? phoneNumber : user.phoneNumber;
            user.address = address ? address : user.address;
            user.gender = gender ? gender : user.gender;
            user.dob = dob ? dob : user.dob;
            user.image = image ? image : user.image;
            await user.save();
            console.log("INFO USER:", user);
            return true;
        } else {
            return false;
        }
    } catch (error) {
        console.log("Update User  error", error)
        return false;
    }
}
const getAllUsers = async () => {
    try {
      return await userModel.find();
    } catch (error) {
      console.log('Get all users error', error);
      throw error;
    }
  };
const getUserById = async (id) => {
    try {
    return await userModel.findById(id);
    } catch (error) {
    console.log('Get users by id error', error);
    return null;
    }
};
  const deleteUserById = async (id) => {
    try {
      await userModel.findByIdAndDelete(id);
      return true;
    } catch (error) {
        console('register error: ', error);
      console.log('Delete users by id error', error);
      return false;
    }
}
const changePassword = async (email, oldPassword, newPassword) => {
    try {
        const user = await userModel.findOne({ email: email })
        if (user) {
            console.log("INFO USER:", user);
            const isPasswordValid = await bcrypt.compare(oldPassword, user.password)
            console.log(isPasswordValid)
            if (isPasswordValid) {
                const salt = bcrypt.genSaltSync(10);
                const hash = bcrypt.hashSync(newPassword, salt);
                user.password = hash
                await user.save();
                return true;
            } else {
                return false
            }
        } else {
            return false;
        }
    } catch (error) {
        console.log("Change Password got an error: ", error);
        throw error;
    }
}
module.exports = { login, register,updateUser , getAllUsers, getUserById, deleteUserById, changePassword};