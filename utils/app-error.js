/*!
 * @author Mohamed Muntasir
 * @link https://github.com/devmotheg
 */

module.exports = class extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode || 500;
    this.status = (statusCode / 100) >> 0 === 5 ? "error" : "fail";
    this.fromApp = true;
  }
};
