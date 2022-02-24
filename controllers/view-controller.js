/*!
 * @author Mohamed Muntasir
 * @link https://github.com/devmotheg
 */

const User = require("../models/user-model"),
	Post = require("../models/post-model"),
	Favorite = require("../models/favorite-model"),
	Bookmark = require("../models/bookmark-model"),
	Hashtag = require("../models/hashtag-model"),
	catchAsync = require("../utils/catch-async"),
	notFoundError = require("../utils/not-found-error");

exports.renderRoot = catchAsync(async (req, res, next) => {
	const posts = await Post.find({}).sort("-createdAt");
	const hashtags = await Hashtag.find({}).sort("-postsQuantity");

	res.status(200).render("pages/overview", {
		title: "Root",
		page: "root",
		posts,
		hashtags,
	});
});

exports.renderTag = catchAsync(async (req, res, next) => {
	const posts = await Post.find({ tags: req.params.tag }).sort("-createdAt");
	const hashtag = await Hashtag.findOne({ tag: req.params.tag });

	if (!hashtag) return notFoundError("hashtag", next);

	res.status(200).render("pages/overview", {
		title: "Tag",
		page: "tag",
		posts,
		hashtag,
	});
});

exports.renderLogIn = catchAsync(async (req, res, next) => {
	res.status(200).render("pages/form", {
		title: "Log In",
		page: "logIn",
	});
});

exports.renderRegister = catchAsync(async (req, res, next) => {
	res.status(200).render("pages/form", {
		title: "Register",
		page: "register",
	});
});

exports.renderCreatePost = catchAsync(async (req, res, next) => {
	res.status(200).render("pages/my-post", {
		title: "Create Post",
		page: "createPost",
	});
});

exports.renderUpdatePost = catchAsync(async (req, res, next) => {
	const post = await Post.findOne({
		_n: req.params.postId,
		userId: req.user._id,
	});
	res.status(200).render("pages/my-post", {
		title: "Update Post",
		page: "updatePost",
		post,
	});
});

exports.renderProfileSettings = catchAsync(async (req, res, next) => {
	res.status(200).render("pages/settings/profile", {
		title: "Profile Settings",
		page: "profileSettings",
		active: "profile",
	});
});

exports.renderSecuritySettings = catchAsync(async (req, res, next) => {
	res.status(200).render("pages/settings/security", {
		title: "Security Settings",
		page: "securitySettings",
		active: "security",
	});
});

exports.renderUser = catchAsync(async (req, res, next) => {
	const searchedUser = await User.findOne({ username: req.params.username });
	const posts = await Post.find({ userId: searchedUser._id });

	if (!searchedUser) return notFoundError("user", next);

	res.status(200).render("pages/user", {
		title: "User",
		page: "user",
		searchedUser,
		posts,
	});
});

exports.renderPost = catchAsync(async (req, res, next) => {
	const user = await User.findOne({ username: req.params.username });

	if (!user) return notFoundError("user", next);

	const post = await Post.findOne({ userId: user._id, _n: req.params.postId });

	if (!post) return notFoundError("post", next);

	post.comments.reverse();

	if (res.locals.user) {
		var favorite = await Favorite.exists({
			userId: res.locals.user._id,
			postId: post._id,
		});
		var bookmark = await Bookmark.exists({
			userId: res.locals.user._id,
			postId: post._id,
		});
	}

	res.status(200).render("pages/post", {
		title: "Post",
		page: "post",
		post,
		favorite,
		bookmark,
	});
});
