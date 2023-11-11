const favoriteService = require('./FavoriteService');

// const getAllFavorite = async (idUser) => {
//     try {
//         return await favoriteService.getAllFavorite(idUser);

//     } catch (error) {
//         return false;
//     }
// }

const deleteFavoriteById = async ( idProduct,idUser) => {
    try {
        return await favoriteService.deleteFavoriteById( idProduct,idUser);
    } catch (error) {
        return false;
    }
}

const addNewFavorite = async (idUser,idProduct) => {
    try {
        return await favoriteService.addNewFavorite(idUser, idProduct);
    } catch (error) {
        return false;
    }
}

const getFavoriteByIdUser = async (idUser) => {
    try {
        return await favoriteService.getFavoriteByIdUser(idUser);
    } catch (error) {
        return null;
    }
}
const getFavoriteById = async (idProduct) => {
    try {
        return await favoriteService.getFavoriteById(idProduct);
    } catch (error) {
        return null;
    }
}


// const updateFavoriteById = async (id, name, quantity, unit) => {
//     try {
//         return await favoriteService.updateFavoriteById(id, name, quantity, unit);
//     } catch (error) {
//         return false;
//     }
// }


module.exports = {  deleteFavoriteById, addNewFavorite, getFavoriteByIdUser, getFavoriteById };