/*!
 * @author Mohamed Muntasir
 * @link https://github.com/devmotheg
 */

const mongoose = require("mongoose"),
  { nanoid } = require("nanoid");
const createField = require("../utils/create-field"),
  referenceModel = require("../utils/reference-model"),
  User = require("./user-model"),
  Post = require("./post-model"),
  updateQuantity = require("../utils/update-quantity");

const commentSchema = new mongoose.Schema({
  _n: {
    type: mongoose.SchemaTypes.String,
    immutable: true,
    unique: true,
    default: nanoid(),
  },
  userId: referenceModel("comment", { Model: User, name: "user" }, true),
  postId: referenceModel("comment", { Model: Post, name: "post" }, true),
  text: createField({
    model: "comment",
    type: "info",
    name: "text",
    required: true,
    min: 1,
    max: 280,
  }),
  createdAt: {
    type: mongoose.SchemaTypes.Date,
    default: Date.now(),
  },
  lastEditedAt: mongoose.SchemaTypes.Date,
});

for (const [Model, refId] of [
  [User, "userId"],
  [Post, "postId"],
])
  updateQuantity({
    updatedModel: Model,
    localSchema: commentSchema,
    updatedField: "commentsQuantity",
    refId,
  });

commentSchema.pre(/^find/i, function (next) {
  this.populate({ path: "userId", select: "username" }).populate({
    path: "postId",
    select: "_n title userId",
  });

  next();
});

commentSchema.pre(/update/i, function (next) {
  this.update(this._conditions, { lastEditedAt: Date.now() });

  next();
});

module.exports = mongoose.model("Comment", commentSchema);

for (const [Model, modelId] of [
  [User, "userId"],
  [Post, "postId"],
])
  Model.listenToDeletion(async id => {
    await module.exports.deleteMany({ [modelId]: id });
  });
