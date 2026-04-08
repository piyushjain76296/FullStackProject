const ApiError = require('../utils/ApiError');

const validate = (schema) => (req, res, next) => {
  try {
    req.query = schema.query ? schema.query.parse(req.query) : req.query;
    req.body = schema.body ? schema.body.parse(req.body) : req.body;
    req.params = schema.params ? schema.params.parse(req.params) : req.params;
    next();
  } catch (error) {
    const errorMessage = error.errors.map((details) => details.message).join(', ');
    return next(new ApiError(400, errorMessage));
  }
};

module.exports = validate;
