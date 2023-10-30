const FavoriteModel = require('./FavoriteModel')

const getAll = async (idUser) => {
    try {
        let favorite = await FavoriteModel.find({ idUser: idUser })
            .populate('product', 'title price size color');
        console.log(favorite);
        if (favorite) {
            return favorite
        } else {
            return false
        }
    } catch (error) {
        console.log('Search Transaction By Money: ', error);
        return null;
    }
}

const deleteFavoriteById = async (id) => {
    try {
        await FavoriteModel.findByIdAndDelete(id);
        return true;
    } catch (e) {
        console.log("EROOR Delete" + e);
        return false
    }
}
const addFavorite = async ( product, idUser, createAt, updateAt) => {
    try {
        const newFavorite = {  product, idUser, createAt, updateAt }
        const favorite = new FavoriteModel(newFavorite);
        await favorite.save();
        return true;
    } catch (e) {
        console.log("EROOR Add Favorite" + e);
        return false
    }
}

module.exports ={getAll, deleteFavoriteById, addFavorite}