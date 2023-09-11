# Kierian

A transaction API

## Technologies Used

- NodeJS
- ExpressJS

### Documentation

======== AUTH ROUTES ======

1. POST `/auth/register` creates a user, and also creates & attach a wallet to the user. Request body requires `name`, `phone` and `pin`. E.g.:

   ```json
   {
     "name": "Theo Iyonor",
     "phone": "08032616345",
     "pin": "1234"
   }
   ```

2. POST `/auth/login` logs the user in. Request body requires `phone` and `pin`.

3. GET `/auth/me` returns the user details including wallet info. Requires authorization token in the headers. `Bearer token`

======== TRANSACTION ROUTES ======

`Bearer token` is required for all routes.

1. GET `/transactions` returns all transactions that involves authenticated user whether as a sender or recipient.

2. POST `/transactions/create` creates a transaction with default status pending. Request body requires `destination` and `amount`

   ```js
   {
     destination: 'KRN123456789', // wallet id of the recipient.
     amount: 200,
   }
   ```

   This will return a response with the newly created transaction details. The response object contains `otp`.
   Ideally, when the api is connected to a SMS provider (which are not free) e.g. TWILIO (see configuration in `sms.handler.js` file and usage in `transaction.controller.js` file), the `otp` should be removed from the object (see `transaction.model.js` file).

3. PUT `/transactions/:id` confirms transaction, i.e. processes the transaction and updates the status to `fail` if sender's wallet balance is insufficient for transaction and `success` if successful. Request body requires `otp`.

   ```json
   { "otp": "1234" }
   ```

4. GET `/transactions/:id` returns transaction with the given id.

#### NOTES

- No Free SMS Provider API to send OTP. So for this test purpose, the OTP is sent as part of the response when an account is created.

- Other endpoints for functionalities like: `Reset PIN`, `Resend OTP for transaction`, etc were not included.

DEMO LINK Base Url: [https](https)
