import mongoose from 'mongoose';

const PaymentSchema = new mongoose.Schema({
  tran_id: {
    type: String,
    required: true,
    unique: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  currency: {
    type: String,
    default: 'BDT',
  },
  status: {
    type: String,
    enum: ['Pending', 'Success', 'Failed', 'Cancelled'],
    default: 'Pending',
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  jobPosting: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
  },
  payment_data: {
    type: Object,
  },
  bank_tran_id: String,
  card_type: String,
  payment_date: Date,
}, { timestamps: true });

export const Payment= mongoose.model('Payment', PaymentSchema);