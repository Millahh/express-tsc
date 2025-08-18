// extended from CustomAPIError
const CustomAPIError = require("./custom-error");
const { StatusCode } = require("http-status-codes");

class UnauthenticatedError extends CustomAPIError {
  constructor(message) {
    super(message);
    // this.statusCode = 401
    // instead of typing it manual, better use the ttp-status-codes package built-in
    this.statusCode = StatusCode.UNAUTHORIZED;
  }
}

module.exports = UnauthenticatedError;
