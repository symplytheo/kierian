const express = require('express');
const { createUser, getUser, loginUser } = require('../controllers/auth.controller');
const isAuthenticated = require('../middleware');
const {
  createTransaction,
  confirmTransaction,
  getUserTransactions,
  getSingleTransaction,
} = require('../controllers/transaction.controller');

// ===== Auth Router =========
const authRouter = express.Router();
authRouter.post('/register', createUser);
authRouter.post('/login', loginUser);
authRouter.get('/me', isAuthenticated, getUser);
// ======

// ===== Transaction Router =========
const trxnRouter = express.Router();
trxnRouter.get('/', isAuthenticated, getUserTransactions);
trxnRouter.post('/create', isAuthenticated, createTransaction);
trxnRouter.get('/:id', isAuthenticated, getSingleTransaction);
trxnRouter.put('/:id', isAuthenticated, confirmTransaction);
// =======

module.exports = { authRouter, trxnRouter };
