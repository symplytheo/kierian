const mongoose = require('mongoose');

const walletSchema = new mongoose.Schema({
  balance: {
    type: Number,
    default: 0,
  },
  id: {
    type: String,
    required: true,
    unique: [true, 'Wallet with Id already exist'],
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
});

walletSchema.set('toJSON', {
  transform: (doc, returned) => {
    delete returned._id;
    delete returned.__v;
    delete returned.user_id;
  },
});

const Wallet = mongoose.model('Wallet', walletSchema);

module.exports = { Wallet };
