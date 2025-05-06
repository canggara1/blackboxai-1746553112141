import mongoose from 'mongoose';

const VariantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  options: [
    {
      name: { type: String, required: true },
      priceModifier: { type: Number, default: 0 },
    },
  ],
  mandatory: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

const Variant = mongoose.model('Variant', VariantSchema);

export default Variant;
