/*!
 * @author Mohamed Muntasir
 * @link https://github.com/devmotheg
 */

const mongoose = require("mongoose"),
  { nanoid } = require("nanoid");
const referenceModel = require("../utils/reference-model"),
  User = require("./user-model"),
  Post = require("./post-model"),
  updateQuantity = require("../utils/update-quantity");

const bookmarkSchema = new mongoose.Schema({
  _n: {
    type: mongoose.SchemaTypes.String,
    immutable: true,
    unique: true,
    default: nanoid(),
  },
  userId: referenceModel("bookmark", { Model: User, name: "user" }, true),
  postId: referenceModel("bookmark", { Model: Post, name: "post" }, true),
  createdAt: {
    type: mongoose.SchemaTypes.Date,
    default: Date.now(),
  },
});

bookmarkSchema.index({ userId: 1, postId: 1 }, { unique: true });

for (const [Model, refId] of [
  [User, "userId"],
  [Post, "postId"],
])
  updateQuantity({
    updatedModel: Model,
    localSchema: bookmarkSchema,
    updatedField: "bookmarksQuantity",
    refId,
  });

bookmarkSchema.pre(/^find/, function (next) {
  this.populate({ path: "postId", select: "-id" });

  next();
});

module.exports = mongoose.model("Bookmark", bookmarkSchema);

for (const [Model, modelId] of [
  [User, "userId"],
  [Post, "postId"],
])
  Model.listenToDeletion(async id => {
    await module.exports.deleteMany({ [modelId]: id });
  });
