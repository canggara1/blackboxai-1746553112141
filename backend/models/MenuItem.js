import mongoose from 'mongoose';

const MenuItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  variants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Variant' }],
  price: { type: Number, required: true },
  description: { type: String },
  imageUrl: { type: String },
  createdAt: { type: Date, default: Date.now },
});

const MenuItem = mongoose.model('MenuItem', MenuItemSchema);

export default MenuItem;
