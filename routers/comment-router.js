/*!
 * @author Mohamed Muntasir
 * @link https://github.com/devmotheg
 */

const express = require("express");
const authController = require("../controllers/auth-controller"),
  commentController = require("../controllers/comment-controller"),
  helperMiddlewares = require("../utils/helper-middlewares");

const router = express.Router({ mergeParams: true });

router.use(authController.fireWall({ protect: true }));

router
  .route("/my-comment")
  .post(commentController.createMyComment)
  .patch(commentController.updateMyComment)
  .delete(commentController.deleteMyComment);

router
  .route("/")
  .get(helperMiddlewares.passQueryFilter, commentController.readAllComments)
  .post(authController.restrictTo("admin"), commentController.createComment);

router.use(authController.restrictTo("admin"));

router
  .route("/:id")
  .get(helperMiddlewares.passQueryFilter, commentController.readComment)
  .patch(
    helperMiddlewares.passQueryFilter,
    commentController.passFilteredBody,
    commentController.updateComment
  )
  .delete(helperMiddlewares.passQueryFilter, commentController.deleteComment);

module.exports = router;
