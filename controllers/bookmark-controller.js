/*!
 * @author Mohamed Muntasir
 * @link https://github.com/devmotheg
 */

const Bookmark = require("../models/bookmark-model"),
	Post = require("../models/post-model"),
	handlerFactory = require("../utils/handler-factory"),
	catchAsync = require("../utils/catch-async");

const factory = handlerFactory.useFactory(handlerFactory, Bookmark, "bookmark");

exports.createMyBookmark = catchAsync(async (req, res, next) => {
	const post = await Post.findOne({ _n: req.body.postId });
	await Bookmark.create({ userId: req.user._id, postId: post._id });

	res.status(200).json({
		status: "success",
		message: `Post added to bookmarks`,
	});
});

exports.deleteMyBookmark = catchAsync(async (req, res, next) => {
	const post = await Post.findOne({ _n: req.body.postId });
	await Bookmark.deleteOne({ userId: req.user._id, postId: post._id });

	res.status(204).json({ status: "success" });
});

exports.readAllBookmarks = factory("readAll");
exports.createBookmark = factory("createOne");
exports.readBookmark = factory("readOne");
exports.deleteBookmark = factory("deleteOne");
