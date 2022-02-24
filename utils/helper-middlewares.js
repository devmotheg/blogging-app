/*!
 * @author Mohamed Muntasir
 * @link https://github.com/devmotheg
 */

exports.passQueryFilter = (req, res, next) => {
  req.queryFilter = {};

  if (req.params.id) req.queryFilter._id = req.params.id;
  if (req.params.username) req.queryFilter.username = req.params.username;
  else if (req.params.postId) req.queryFilter._n = req.params.postId;

  next();
};
