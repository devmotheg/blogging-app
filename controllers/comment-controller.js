/*!
 * @author Mohamed Muntasir
 * @link https://github.com/devmotheg
 */

const Comment = require("../models/comment-model"),
	Post = require("../models/post-model"),
	handlerFactory = require("../utils/handler-factory"),
	catchAsync = require("../utils/catch-async.js");

const factory = handlerFactory.useFactory(handlerFactory, Comment, "comment");

exports.passFilteredBody = (req, res, next) => {
	req.filteredBody = { text: req.body.text };

	next();
};

exports.createMyComment = catchAsync(async (req, res, next) => {
	const post = await Post.findOne({ _n: req.body.postId });
	const newComment = await Comment.create({
		userId: req.user._id,
		postId: post._id,
		text: req.body.text,
	});

	await newComment.populate({ path: "userId", select: "-id" });
	delete newComment._id;

	res.status(200).json({
		status: "success",
		message: "Your comment was added to the post",
		data: { comment: newComment },
	});
});

exports.updateMyComment = catchAsync(async (req, res, next) => {
	const updatedComment = await Comment.findOneAndUpdate(
		{ _n: req.body.commentId },
		{ text: req.body.text },
		{ new: true, runValidators: true }
	).select("-id");

	res.status(200).json({
		status: "success",
		message: "Your comment was updated",
		data: { comment: updatedComment },
	});
});

exports.deleteMyComment = catchAsync(async (req, res, next) => {
	await Comment.deleteOne({ _n: req.body.commentId, userId: req.user._id });

	res.status(204).json({ status: "success" });
});

exports.readAllComments = factory("readAll");
exports.createComment = factory("createOne");
exports.readComment = factory("readOne");
exports.updateComment = factory("updateOne");
exports.deleteComment = factory("deleteOne");
