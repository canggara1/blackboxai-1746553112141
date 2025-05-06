import mongoose from 'mongoose';

const DiscountItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  discountPercent: { type: Number, required: true },
  active: { type: Boolean, default: true },
  validFrom: { type: Date },
  validTo: { type: Date },
  createdAt: { type: Date, default: Date.now },
});

const DiscountItem = mongoose.model('DiscountItem', DiscountItemSchema);

export default DiscountItem;
