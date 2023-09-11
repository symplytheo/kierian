const { User } = require('../models/user.model');
const errorHandler = require('../helpers/error.handler');
const { Wallet } = require('../models/wallet.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const ShortUniqueId = require('short-unique-id');

const createUser = async (req, res) => {
  try {
    // create a wallet
    const uid = new ShortUniqueId({ dictionary: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'] });
    const id = 'KRN' + uid.rnd(9);
    const wallet = new Wallet({ id });
    // hash pin
    if (req.body.pin) {
      const salt = await bcrypt.genSalt(10);
      req.body.pin = await bcrypt.hash(req.body.pin, salt);
    }
    // create
    const user = await User.create({ ...req.body });
    // attach wallet to user
    wallet.user_id = user._id;
    await wallet.save();
    // generate access token
    const token = jwt.sign({ _id: user._id, phone: user.phone }, process.env.TOKEN_SECRET, {
      expiresIn: '3d',
    });
    // response
    return res
      .status(200)
      .json({ success: true, message: 'user created successfully', data: { ...user.toObject(), wallet, token } });
  } catch (err) {
    errorHandler(err, res, 'user');
    console.log(err);
  }
};

const getUser = async (req, res) => {
  try {
    const { phone, _id } = req.user;
    const user = await User.findOne({ phone, _id });
    const wallet = await Wallet.findOne({ user_id: _id });
    // response
    return res.status(200).json({ success: true, data: { ...user.toObject(), wallet } });
  } catch (err) {
    errorHandler(err, res, 'user');
  }
};

const loginUser = async (req, res) => {
  try {
    const user = await User.findOne({ phone: req.body.phone });
    if (!user) return res.status(404).json({ success: false, error: 'user with phone number does not exist' });
    if (!req.body.pin) return res.status(400).json({ success: false, error: 'pin is required' });
    // verify pin
    const isMatch = await bcrypt.compare(req.body.pin, user.pin);
    // mismatched
    if (!isMatch) return res.status(403).json({ success: false, error: 'pin is incorrect' });
    // generate token
    const token = jwt.sign({ _id: user._id, phone: user.phone }, process.env.TOKEN_SECRET, {
      expiresIn: '3d',
    });
    // response
    return res.status(200).json({ success: true, message: 'login successful', data: { ...user.toObject(), token } });
  } catch (err) {
    errorHandler(err, res, 'user');
  }
};

module.exports = { createUser, getUser, loginUser };
