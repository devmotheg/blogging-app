/*!
 * @author Mohamed Muntasir
 * @link https://github.com/devmotheg
 */

const User = require("../models/user-model"),
  catchAsync = require("./catch-async"),
  notFoundError = require("./not-found-error");

exports.passQueryFilter = (req, res, next) => {
  req.queryFilter = {};

  if (req.params.id) req.queryFilter._id = req.params.id;
  if (req.params.username) req.queryFilter.username = req.params.username;
  else if (req.params.postId) req.queryFilter._n = req.params.postId;

  next();
};

exports.setUserId = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ username: req.queryFilter.username });

  if (!user) return notFoundError("user", next);

  req.queryFilter.userId = user._id;
  delete req.queryFilter.username;

  next();
});
