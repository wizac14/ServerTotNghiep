const FavoriteModel = require('./FavoriteModel')

const getAll = async (idUser) => {
    try {
        let favorite = await FavoriteModel.find({ idUser: idUser })
            .populate('product', 'title price size')
            .populate('idUser', 'name email');
        console.log(favorite);
        if (favorite) {
            return favorite
        } else {
            return false
        }
    } catch (error) {
        console.log('Error get all favorite: ', error);
        return null;
    }
}

const deleteFavoriteById = async (id) => {
    try {
        await FavoriteModel.findByIdAndDelete(id);
        return true;
    } catch (e) {
        console.log("ERROR Delete" + e);
        return false
    }
}
const addFavorite = async (product, idUser, isFavorite) => {
    try {
        const newFavorite = { product, idUser, isFavorite }
        const favorite = new FavoriteModel(newFavorite);
        
        await favorite.save();
        return true;
    } catch (e) {
        console.log("ERROR Add Favorite" + e);
        return false
    }
}

module.exports = { getAll, deleteFavoriteById, addFavorite }