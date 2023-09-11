/**
 * import @errorController in your route controller file
   then use in your try-catch block or then-catch block
 * @params are @err @res @model
    @err is the error from your catch block
    @res is the res from your route controller
    @model is a string of the name of your model e.g. 'user', 'todo', etc
 * e.g.
 * try { 
      ...some statement
      .....
  } catch (err) {
    errorController(err, res, model)
  }
*/

const handleDuplicateKeyError = (err, model) => {
  const field = Object.keys(err.keyValue);
  return [409, `${model} with ${field[0]} already exist`];
};

const handleValidationError = (err, model) => {
  const field = Object.keys(err.errors);
  return [400, err.errors[field[0]].message];
};

const handleCastError = (err, model) => {
  return [404, `${model} with ${err.path} does not exist`];
};

function errorHandler(error, res, model) {
  let errMsg, code;
  // validation errors
  if (error.name === 'ValidationError') {
    [code, errMsg] = handleValidationError(error, model);
  }
  // unique key error
  else if (error.code && error.code === 11000) {
    [code, errMsg] = handleDuplicateKeyError(error, model);
  }
  // filter @params (e.g. id, name, etc) not found
  else if (error.name === 'CastError') {
    [code, errMsg] = handleCastError(error, model);
  }

  // return error response
  if (code && errMsg) {
    return res.status(code).json({ success: false, error: errMsg });
    //
  } else {
    return res
      .status(500)
      .send({ success: false, error: Object.keys(error).length ? error : 'something went wrong on the server' });
  }
}

module.exports = errorHandler;
