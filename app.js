/*!
 * @author Mohamed Muntasir
 * @link https://github.com/devmotheg
 */

const path = require("path");
const express = require("express"),
	cookieParser = require("cookie-parser"),
	hpp = require("hpp");
const userRouter = require("./routers/user-router"),
	postRouter = require("./routers/post-router"),
	favoriteRouter = require("./routers/favorite-router"),
	bookmarkRouter = require("./routers/bookmark-router"),
	commentRouter = require("./routers/comment-router"),
	hashtagRouter = require("./routers/hashtag-router"),
	viewRouter = require("./routers/view-router"),
	globalErrorController = require("./controllers/global-error-controller"),
	AppError = require("./utils/app-error"),
	User = require("./models/user-model"),
	Post = require("./models/post-model"),
	Favorite = require("./models/favorite-model"),
	Bookmark = require("./models/bookmark-model"),
	Comment = require("./models/comment-model"),
	Hashtag = require("./models/hashtag-model");

const app = express();

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public/static")));

app.use(express.json());
app.use(cookieParser());

const whitelist = [];
for (const Model of [User, Post, Favorite, Bookmark, Comment, Hashtag])
	whitelist.push(...Object.keys(Model.schema.obj));
app.use(hpp({ whitelist }));

app.use("/api/v1/users", userRouter);
app.use("/api/v1/posts", postRouter);
app.use("/api/v1/favorites", favoriteRouter);
app.use("/api/v1/bookmarks", bookmarkRouter);
app.use("/api/v1/comments", commentRouter);
app.use("/api/v1/hashtags", hashtagRouter);
app.use("/", viewRouter);

app.all("*", (req, res, next) => {
	next(
		new AppError(
			`This route "${req.originalUrl}" doesn't exit in our server`,
			404
		)
	);
});

app.use(globalErrorController);

module.exports = app;
