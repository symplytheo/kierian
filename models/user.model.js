const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    unique: true,
    required: true,
  },
  pin: {
    type: String,
    required: true,
  },
  created_at: { type: Date, default: Date.now() },
});

['toJSON', 'toObject'].forEach((key) => {
  userSchema.set(key, {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id;
      delete returnedObject._id;
      delete returnedObject.__v;
      //do not reveal hashed pin
      delete returnedObject.pin;
    },
  });
});

const User = mongoose.model('User', userSchema);

module.exports = { User };
