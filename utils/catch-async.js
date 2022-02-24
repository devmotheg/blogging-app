/*!
 * @author Mohamed Muntasir
 * @link https://github.com/devmotheg
 */

module.exports = asyncFun => {
  const wrapper =
    asyncFun.length === 3
      ? (req, res, next) => asyncFun(req, res, next).catch(next)
      : asyncFun.length === 2
        ? function (result, next) {
          const newAsyncFun = asyncFun.bind(this);
          newAsyncFun(result, next).catch(next);
        }
        : function (next) {
          const newAsyncFun = asyncFun.bind(this);
          newAsyncFun(next).catch(next);
        };
  return wrapper;
};
