/*!
 * @author Mohamed Muntasir
 * @link https://github.com/devmotheg
 */

const Hashtag = require("../models/hashtag-model"),
  handlerFactory = require("../utils/handler-factory");

const factory = handlerFactory.useFactory(handlerFactory, Hashtag, "hashtag");

exports.readAllHashtags = factory("readAll");
exports.createHashtag = factory("createOne");
exports.readHashtag = factory("readOne");
exports.deleteHashtag = factory("deleteOne");
