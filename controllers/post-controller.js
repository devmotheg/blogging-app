/*!
 * @author Mohamed Muntasir
 * @link https://github.com/devmotheg
 */

const Post = require("../models/post-model"),
	handlerFactory = require("../utils/handler-factory"),
	catchAsync = require("../utils/catch-async");

const factory = handlerFactory.useFactory(handlerFactory, Post, "post");

exports.passFilteredBody = (req, res, next) => {
	req.filteredBody = { ...req.body };
	delete req.filteredBody.userId;

	next();
};

exports.createMyPost = catchAsync(async (req, res, next) => {
	const newPost = await Post.create({
		title: req.body.title,
		tags: req.body.tags,
		content: req.body.content,
		userId: req.user._id,
	});

	await newPost.populate({ path: "userId", select: "-id" });
	delete newPost._id;

	res.status(201).json({
		status: "success",
		data: { post: newPost },
	});
});

exports.updateMyPost = catchAsync(async (req, res, next) => {
	const updatedPost = await Post.findOneAndUpdate(
		{ _n: req.body.postId },
		{
			title: req.body.title,
			tags: req.body.tags,
			content: req.body.content,
		},
		{ new: true, runValidators: true }
	)
		.populate({ path: "userId", select: "-id" })
		.select("-id");

	res.status(200).json({
		status: "success",
		data: { post: updatedPost },
	});
});

exports.deleteMyPost = catchAsync(async (req, res, next) => {
	await Post.deleteOne({ _n: req.body.postId, userId: req.user._id });

	res.status(204).json({ status: "success" });
});

exports.readAllPosts = factory("readAll");
exports.createPost = factory("createOne");
exports.readPost = factory("readOne");
exports.updatePost = factory("updateOne");
exports.deletePost = factory("deleteOne");
