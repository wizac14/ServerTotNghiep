
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const productSchema = new Schema({
    id: { type: ObjectId },
    title: { type: String },
    price: { type: Number },
    discount: { type: Number },
    size: { type: Number , default: 0},
    color: { type: String },
    quantity: { type: Number },
    image: { type: String },
    description: { type: String },
    brand: {type: ObjectId, ref: 'brand'}, //khoá ngoại
});

module.exports = mongoose.models.product || mongoose.model('product', productSchema);