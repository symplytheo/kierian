const express = require('express');
const mongoose = require('mongoose');
const { authRouter, trxnRouter } = require('./routes');
require('dotenv').config();

const app = express();

const PORT = process.env.PORT || 3000;

// ==== Connect Databasse =====
(function () {
  mongoose
    .connect(process.env.DATABASE_URI)
    .then(() => console.log(`[DATABASE]: Connection successful`))
    .catch((err) => console.log(`[DB/ERROR]: ${err}`));
})(); // ========================

// parse application/json
app.use(express.json({ limit: '50mb' }));
// parse application/x-www-form-urlencoded
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// ==== Routes =====
// Welcome
app.get('/', (req, res) => {
  res.send(`(c) ${new Date().getFullYear()} Kierian Technologies`);
});
// authentications
app.use('/auth', authRouter);
// transactions
app.use('/transactions', trxnRouter);
//

// ==== Listener =====
app.listen(PORT, () => {
  console.log(`[SERVER]: Listening on port:${PORT}`);
});
