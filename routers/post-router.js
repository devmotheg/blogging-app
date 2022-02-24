/*!
 * @author Mohamed Muntasir
 * @link https://github.com/devmotheg
 */

const express = require("express");
const favoriteRouter = require("../routers/favorite-router"),
  bookmarkRouter = require("../routers/bookmark-router"),
  commentRouter = require("../routers/comment-router"),
  authController = require("../controllers/auth-controller"),
  postController = require("../controllers/post-controller"),
  helperMiddlewares = require("../utils/helper-middlewares");

const router = express.Router();

router.use("/:postId/favorites", favoriteRouter);
router.use("/:postId/bookmarks", bookmarkRouter);
router.use("/:postId/comments", commentRouter);

router.use(authController.fireWall({ protect: true }));

router
  .route("/my-post")
  .post(postController.createMyPost)
  .patch(postController.updateMyPost)
  .delete(postController.deleteMyPost);

router
  .route("/")
  .get(helperMiddlewares.passQueryFilter, postController.readAllPosts)
  .post(authController.restrictTo("admin"), postController.createPost);

router.use(authController.restrictTo("admin"));

router
  .route("/:id")
  .get(helperMiddlewares.passQueryFilter, postController.readPost)
  .patch(
    helperMiddlewares.passQueryFilter,
    postController.passFilteredBody,
    postController.updatePost
  )
  .delete(helperMiddlewares.passQueryFilter, postController.deletePost);

module.exports = router;
