const errorHandler = require('../helpers/error.handler');
const { Transaction } = require('../models/transaction.model');
const { User } = require('../models/user.model');
const { Wallet } = require('../models/wallet.model');
const ShortUniqueId = require('short-unique-id');
// const sendSMSOtp = require('../helpers/sms.handler');         // uncomment if twilio keys are available

const createTransaction = async (req, res) => {
  try {
    const { phone, _id } = req.user;
    const sender = await User.findOne({ phone, _id });
    const wallet = await Wallet.findOne({ user_id: _id });
    // create transaction
    if (!req.body.amount) return res.status(400).json({ success: false, error: 'amount is required' });
    const transaction = new Transaction({ amount: req.body.amount, sender_wallet_id: wallet.id });
    // get recipient
    const destWallet = await Wallet.findOne({ id: req.body.destination });
    if (!destWallet) return res.status(400).json({ success: false, error: 'destination wallet id is invalid' });
    transaction.destination_wallet_id = destWallet.id;
    const destination = await User.findOne({ _id: destWallet.user_id });
    // generate otp and send otp
    const uid = new ShortUniqueId({ dictionary: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'] });
    const otp = uid.rnd(6);

    /* ================================
    await sendSMSOtp(sender.phone)
    // 
    NOTE: =========
        For now, we return the OTP as part of transaction data response.
        Otp be hidden on the transaction schema if SMS Services like Twilio is connected
    // ================================ */
    transaction.otp = otp;
    await transaction.save();
    // response
    return res.status(200).json({ success: true, data: { ...transaction.toObject(), sender, destination } });
  } catch (error) {
    errorHandler(error, res, 'transaction');
  }
};

const confirmTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findOne({ _id: req.params.id });
    // verify otp
    if (transaction.otp !== req.body.otp) return res.status(400).json({ success: false, error: 'otp is invalid' });
    // update wallet balances
    const senderWallet = await Wallet.findOne({ id: transaction.sender_wallet_id });
    if (transaction.amount > senderWallet.balance) {
      // update transaction status - fail
      await transaction.updateOne({ status: 'fail' });
      // return
      return res.status(403).json({ success: false, error: 'insufficent wallet balance' });
    }
    await senderWallet.updateOne({ balance: senderWallet.balance - transaction.amount });
    // update destination wallet balance
    const destWallet = await Wallet.findOne({ id: transaction.destination_wallet_id });
    await destWallet.updateOne({ balance: destWallet.balance + transaction.amount });
    // update transaction status - success
    await transaction.updateOne({ status: 'success' });
    // response
    return res.status(200).json({ success: true, data: transaction });
  } catch (err) {
    errorHandler(err, res, 'user');
  }
};

const getUserTransactions = async (req, res) => {
  try {
    const wallet = await Wallet.findOne({ user_id: req.user._id });
    // get all transactions that involve auth user's wallet id
    // either as a sender_wallet or destination_wallet
    const transactions = await Transaction.find({
      $or: [{ sender_wallet_id: wallet.id }, { destination_wallet_id: wallet.id }],
    });
    // response
    return res.status(200).json({ success: true, data: transactions });
  } catch (err) {
    errorHandler(err, res, 'user');
  }
};

const getSingleTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findOne({ _id: req.params.id });
    // get sender info
    const senderWallet = await Wallet.findOne({ id: transaction.sender_wallet_id });
    const sender = await User.findOne({ _id: senderWallet.user_id });
    // get destination info
    const destWallet = await Wallet.findOne({ id: transaction.destination_wallet_id });
    const destination = await User.findOne({ _id: destWallet.user_id });
    // response
    return res.status(200).json({ success: true, data: { ...transaction.toObject(), sender, destination } });
  } catch (err) {
    errorHandler(err, res, 'user');
  }
};

module.exports = { createTransaction, confirmTransaction, getSingleTransaction, getUserTransactions };
