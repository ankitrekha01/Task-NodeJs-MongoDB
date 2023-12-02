const validator = require("validator");
const sanitizeInput = (input) => {
  return validator.escape(validator.trim(input));
};

module.exports = sanitizeInput;
