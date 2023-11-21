const  FavoriteService = require('./FavoriteService')

const getAll = async (idUser) => {
    try {
        return await FavoriteService.getAll(idUser);
    } catch (error) {
        console.log('Get All Favorite error: ', error);
    }
    return null;
}
const addFavorite = async ( product, idUser,isFavorite) => {
    try {
        return await FavoriteService.addFavorite( product, idUser, isFavorite);
    } catch (error) {
        console.log('Add Favorite error: ', error);
    }
    return null;
}


const deleteFavoriteById = async (id) => {
    try {
        return await FavoriteService.deleteFavoriteById(id);
    } catch (error) {
        console.log('Delete Favorite By Id error: ', error);
    }
    return null;
}

module.exports ={getAll, deleteFavoriteById, addFavorite}