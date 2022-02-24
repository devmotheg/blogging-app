/*!
 * @author Mohamed Muntasir
 * @link https://github.com/devmotheg
 */

const Favorite = require("../models/favorite-model"),
	Post = require("../models/post-model"),
	handlerFactory = require("../utils/handler-factory"),
	catchAsync = require("../utils/catch-async");

const factory = handlerFactory.useFactory(handlerFactory, Favorite, "favorite");

exports.createMyFavorite = catchAsync(async (req, res, next) => {
	const post = await Post.findOne({ _n: req.body.postId });
	await Favorite.create({ userId: req.user._id, postId: post._id });

	res.status(200).json({
		status: "success",
		message: `Post added to favorites`,
	});
});

exports.deleteMyFavorite = catchAsync(async (req, res, next) => {
	const post = await Post.findOne({ _n: req.body.postId });
	await Favorite.deleteOne({ userId: req.user._id, postId: post._id });

	res.status(204).json({ status: "success" });
});

exports.readAllFavorites = factory("readAll");
exports.createFavorite = factory("createOne");
exports.readFavorite = factory("readOne");
exports.deleteFavorite = factory("deleteOne");
