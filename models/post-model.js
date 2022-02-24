/*!
 * @author Mohamed Muntasir
 * @link https://github.com/devmotheg
 */

const { EventEmitter } = require("events");
const mongoose = require("mongoose"),
	{ nanoid } = require("nanoid"),
	slugify = require("slugify");
const createField = require("../utils/create-field"),
	referenceModel = require("../utils/reference-model"),
	User = require("./user-model"),
	Hashtag = require("./hashtag-model"),
	updateQuantity = require("../utils/update-quantity"),
	catchAsync = require("../utils/catch-async");

const getTags = posts =>
	posts.reduce((acc, p) => {
		if (p.tags) acc.push(...p.tags);
		return acc;
	}, []);

const checkHashtags = async tags => {
	for (const tag of tags)
		if (!(await Hashtag.findOne({ tag }))) await Hashtag.create({ tag });
};

const modifyPostsQuantity = async (Post, tags) => {
	for (const tag of tags) {
		const postsQuantity = await Post.count({ tags: tag });
		if (!postsQuantity) await Hashtag.deleteOne({ tag });
		else await Hashtag.findOneAndUpdate({ tag }, { postsQuantity });
	}
};

const postEmitter = new EventEmitter();

const postSchema = new mongoose.Schema(
	{
		_n: {
			type: mongoose.SchemaTypes.String,
			immutable: true,
			unique: true,
			default: nanoid(),
		},
		title: Object.assign(
			createField({
				model: "post",
				type: "info",
				name: "title",
				required: true,
				min: 6,
				max: 96,
			}),
			{ match: [/^.+$/, "Post titles can't include new lines"] }
		),
		slug: mongoose.SchemaTypes.String,
		content: createField({
			model: "post",
			type: "info",
			name: "content",
			required: true,
			min: 50,
			max: 600,
		}),
		favoritesQuantity: createField({
			model: "post",
			type: "summary",
			name: "favorites",
		}),
		bookmarksQuantity: createField({
			model: "post",
			type: "summary",
			name: "bookmarks",
		}),
		commentsQuantity: createField({
			model: "post",
			type: "summary",
			name: "comments",
		}),
		userId: referenceModel("post", { Model: User, name: "user" }, true),
		tags: {
			type: [
				{
					type: mongoose.SchemaTypes.String,
					match: [
						/^[a-zA-Z_0-9]{2,18}$/,
						"A tag can only contain letters, numbers, and underscores",
					],
				},
			],
			validate: {
				validator: function (tags) {
					const map = {};
					for (const tag of tags) {
						if (map[tag]) return false;
						map[tag] = true;
					}
					return tags.length <= 4;
				},
				message: "A post can only have up to 4 unique hashtags",
			},
		},
		createdAt: {
			type: mongoose.SchemaTypes.Date,
			default: Date.now(),
		},
		lastEditedAt: mongoose.SchemaTypes.Date,
	},
	{
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
	}
);

postSchema.index({ title: 1, userId: 1 }, { unique: true });

postSchema.virtual("comments", {
	ref: "Comment",
	foreignField: "postId",
	localField: "_id",
});

updateQuantity({
	updatedModel: User,
	localSchema: postSchema,
	updatedField: "postsQuantity",
	refId: "userId",
});

postSchema.pre("save", function (next) {
	this.slug = slugify(this.title, { lower: true });

	next();
});

postSchema.pre(
	"save",
	catchAsync(async function (next) {
		await checkHashtags(this.tags);
		next();
	})
);

postSchema.post(
	"save",
	catchAsync(async function (result, next) {
		for (const tag of this.tags) {
			const hashtag = await Hashtag.findOne({ tag });
			hashtag.postsQuantity++;

			await hashtag.save();
		}

		next();
	})
);

postSchema.pre(/^find/i, function (next) {
	this.populate({ path: "userId", select: "username createdAt" });

	next();
});

postSchema.pre(/^findOne|^findById/i, function (next) {
	this.populate({ path: "comments", sort: "-createdAt" });

	next();
});

postSchema.pre("findOneAndUpdate", async function (next) {
	if (/title|content|tags/.test(JSON.stringify(this._update)))
		this._update.lastEditedAt = Date.now();

	next();
});

postSchema.pre(
	/update|delete/i,
	catchAsync(async function (next) {
		this.posts = await this.model.find(this._conditions);

		if (/delete/i.test(this.op))
			for (const post of this.posts) postEmitter.emit("delete", post._id);

		next();
	})
);

postSchema.post(
	/update|delete/i,
	catchAsync(async function (result, next) {
		if (!this.posts || !result) return next();
		const resultArr = Array.isArray(result) ? result : [result];
		const allTags = [
			...new Set([...getTags(this.posts), ...getTags(resultArr)]),
		];
		await checkHashtags(allTags);
		await modifyPostsQuantity(this.model, allTags);

		next();
	})
);

postSchema.static("listenToDeletion", function (fun) {
	postEmitter.addListener("delete", fun);
});

module.exports = mongoose.model("Post", postSchema);

User.listenToDeletion(async userId => {
	await module.exports.deleteMany({ userId });
});
