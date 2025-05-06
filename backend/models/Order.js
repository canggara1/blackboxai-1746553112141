import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema({
  items: [
    {
      menuItem: { type: mongoose.Schema.Types.ObjectId, ref: 'MenuItem', required: true },
      variantSelections: [
        {
          variant: { type: mongoose.Schema.Types.ObjectId, ref: 'Variant' },
          optionName: { type: String },
        },
      ],
      quantity: { type: Number, required: true, default: 1 },
      price: { type: Number, required: true },
    },
  ],
  discounts: [
    {
      discountItem: { type: mongoose.Schema.Types.ObjectId, ref: 'DiscountItem' },
      amount: { type: Number },
    },
  ],
  totalPayable: { type: Number, required: true },
  paymentMethod: { type: String, enum: ['cash', 'qris'], required: true },
  paymentStatus: { type: String, enum: ['pending', 'paid', 'failed'], default: 'pending' },
  createdAt: { type: Date, default: Date.now },
});

const Order = mongoose.model('Order', OrderSchema);

export default Order;
