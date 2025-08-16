// extended from CustomAPIError
const CustomAPIError = require("./custom-error");
const { StatusCode } = require("http-status-codes");

class BadRequest extends CustomAPIError {
  constructor(message) {
    super(message);
    // this.statusCode = 400
    // instead of typing it manual, better use the ttp-status-codes package built-in
    this.statusCode = StatusCode.BAD_REQUEST;
  }
}

module.exports = BadRequest;
