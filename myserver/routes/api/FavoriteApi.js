const express = require('express');
const router = express.Router();
const FavoriteController = require('../../components/favorite/FavoriteController');

//http://localhost:3000/api/favorite/get-by-idUser?idUser=
router.get('/get-by-idUser', async (req, res, next) => {
    try {
        const { idUser } = req.query;
        const favorite = await FavoriteController.getAll(idUser);
        if (favorite) {
            return res.status(200).json({ message: "Get All success", result: true, favorite: favorite });
        }
        return res.status(400).json({ message: "Get All failed", result: false, favorite: favorite });

    } catch (error) {
        console.log('Search Favorite by Id error: ', error)
        return res.status(500).json({ result: false, favorite: null });
    }
});
//http://localhost:3000/api/favorite/add-new
router.post('/add-new', async (req, res, next) => {
    try {
        const {  product, idUser, isFavorite } = req.body;
        const favorite = await FavoriteController.addFavorite( product, idUser, isFavorite);
        isFavorite = true;
        if (favorite) {
            return res.status(200).json({ message: "Add new success", result: true, favorite: favorite });
        }
        return res.status(400).json({ message: "Add new failed", result: false, favorite: favorite });

    } catch (error) {
        console.log('Search Favorite by Id error: ', error)
        return res.status(500).json({ result: false, favorite: null });
    }
});
//http://localhost:3000/api/favorite/delete-by-id?id=
router.delete('/delete-by-id', async (req, res, next) => {
    try {
        const { id } = req.query;
        const favorite = await FavoriteController.deleteFavoriteById(id);
        if (favorite) {
            return res.status(200).json({ message: "Delete success", result: true, favorite: favorite });
        }
        return res.status(400).json({ message: "Delete failed", result: false, favorite: favorite });
    } catch (error) {
        console.log('Search Favorite by Id error: ', error)
        return res.status(500).json({ result: false, favorite: null });
    }
});



module.exports = router;