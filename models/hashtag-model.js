/*!
 * @author Mohamed Muntasir
 * @link https://github.com/devmotheg
 */

const mongoose = require("mongoose");
const createField = require("../utils/create-field");

const hashtagSchema = new mongoose.Schema({
  tag: Object.assign(
    createField({
      model: "hashtag",
      type: "info",
      name: "tag",
      unique: true,
      required: true,
      min: 2,
      max: 18,
    }),
    {
      lowercase: true,
      match: [
        /^[a-zA-Z_0-9]{2,18}$/,
        "A hashtag can only contain letters, numbers, and underscores",
      ],
    }
  ),
  postsQuantity: createField({
    model: "hashtag",
    type: "summary",
    name: "posts",
  }),
});

module.exports = mongoose.model("Hashtag", hashtagSchema);
