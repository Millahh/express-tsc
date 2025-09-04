class CustomAPIError extends Error {
  statusCode?: number; // optional, so child classes can set it

  constructor(message: string) {
    super(message);
    this.name = this.constructor.name; 
    Object.setPrototypeOf(this, new.target.prototype); 
  }
}

export default CustomAPIError;
