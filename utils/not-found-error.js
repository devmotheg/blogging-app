/*!
 * @author Mohamed Muntasir
 * @link https://github.com/devmotheg
 */

const AppError = require("./app-error");

module.exports = (name, next) =>
  next(new AppError(`Couldn't find the specified ${name}`, 404));
