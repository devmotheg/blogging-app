/*!
 * @author Mohamed Muntasir
 * @link https://github.com/devmotheg
 */

const { EventEmitter } = require("events");
const mongoose = require("mongoose"),
	bcrypt = require("bcrypt");
const createField = require("../utils/create-field"),
	catchAsync = require("../utils/catch-async");

const userEmitter = new EventEmitter();

const userSchema = new mongoose.Schema({
	username: {
		type: mongoose.SchemaTypes.String,
		unique: true,
		match: [
			/^[a-zA-Z_0-9]{2,16}$/,
			"A username can only contain letters, numbers, and underscores and have a length ranging from 2 up to 16",
		],
		required: [true, "A user must have a username"],
	},
	password: Object.assign(
		createField({
			model: "user",
			type: "info",
			name: "password",
			required: true,
			min: 8,
		}),
		{ select: false }
	),
	passwordChangedAt: mongoose.SchemaTypes.Date,
	role: {
		type: mongoose.SchemaTypes.String,
		default: "user",
		enum: {
			values: ["user", "admin"],
			message: "A user can either have a role of user or admin",
		},
	},
	postsQuantity: createField({
		model: "user",
		type: "summary",
		name: "posts",
	}),
	favoritesQuantity: createField({
		model: "user",
		type: "summary",
		name: "favorites",
	}),
	bookmarksQuantity: createField({
		model: "user",
		type: "summary",
		name: "bookmarks",
	}),
	commentsQuantity: createField({
		model: "user",
		type: "summary",
		name: "comments",
	}),
	createdAt: {
		type: mongoose.SchemaTypes.Date,
		default: Date.now(),
	},
});

userSchema.pre(
	"save",
	catchAsync(async function (next) {
		if (!this.isModified("password")) return next();

		this.password = await bcrypt.hash(
			this.password,
			process.env.BCRYPT_SALT * 1
		);
		if (!this.isNew) this.passwordChangedAt = Date.now() - 5000;

		next();
	})
);

userSchema.pre(
	/delete/i,
	catchAsync(async function (next) {
		const users = await this.model.find(this._conditions);
		for (const user of users) userEmitter.emit("delete", user._id);

		next();
	})
);

userSchema.method(
	"comparePassword",
	async function (candidatePassword, userPassword) {
		return await bcrypt.compare(candidatePassword, userPassword);
	}
);

userSchema.method("passwordChangedAfter", function (date) {
	if (!this.passwordChangedAt) return false;
	return date < ~~(new Date(this.passwordChangedAt).getTime() / 1000);
});

userSchema.static("listenToDeletion", function (fun) {
	userEmitter.addListener("delete", fun);
});

module.exports = mongoose.model("User", userSchema);
