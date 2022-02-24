/*!
 * @author Mohamed Muntasir
 * @link https://github.com/devmotheg
 */

const express = require("express");
const authController = require("../controllers/auth-controller"),
  hashtagController = require("../controllers/hashtag-controller"),
  helperMiddlewares = require("../utils/helper-middlewares");

const router = express.Router();

router.use(
  authController.fireWall({ protect: true }),
  authController.restrictTo("admin")
);

router
  .route("/")
  .get(helperMiddlewares.passQueryFilter, hashtagController.readAllHashtags)
  .post(hashtagController.createHashtag);

router
  .route("/:id")
  .get(helperMiddlewares.passQueryFilter, hashtagController.readHashtag)
  .delete(helperMiddlewares.passQueryFilter, hashtagController.deleteHashtag);

module.exports = router;
