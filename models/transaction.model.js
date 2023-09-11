const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  amount: {
    type: Number,
    required: true,
  },
  sender_wallet_id: {
    type: String,
    required: true,
  },
  destination_wallet_id: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
    enum: ['success', 'fail', 'pending'],
    default: 'pending',
  },
  otp: { type: String },
});

['toJSON', 'toObject'].forEach((key) => {
  transactionSchema.set(key, {
    transform: (doc, returnedObject) => {
      returnedObject.id = returnedObject._id;
      delete returnedObject._id;
      delete returnedObject.__v;
      //do not reveal otp
      // delete returnedObject.otp;
    },
  });
});

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = { Transaction };
