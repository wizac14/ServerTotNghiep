
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const favoriteSchema = new Schema({
    id: { type: ObjectId },
    product: {type: ObjectId, ref: 'product'}, //khoá ngoại
    idUser: {type: ObjectId, ref: 'user'}, //khoá ngoại
    createAt: { type: Date, default: Date.now},
    updateAt: { type: Date, default: Date.now },
    isFavorite: { type: Boolean, default: false },
});

module.exports = mongoose.models.favorite || mongoose.model('favorite', favoriteSchema);