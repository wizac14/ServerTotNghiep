const brandModel = require('./BrandModel');

const getBrand = async()=>{
    try {
        
        return await brandModel.find();
    } catch (error) {
       console.log(error);
    }
}

module.exports = {getBrand}