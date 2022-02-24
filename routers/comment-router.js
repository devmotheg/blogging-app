/*!
 * @author Mohamed Muntasir
 * @link https://github.com/devmotheg
 */

const express = require("express");
const authController = require("../controllers/auth-controller"),
  commentController = require("../controllers/comment-controller"),
  helperMiddlewares = require("../utils/helper-middlewares");

const router = express.Router({ mergeParams: true });

router
  .route("/my-comment")
  .post(
    authController.fireWall({ protect: true }),
    commentController.createMyComment
  )
  .patch(
    authController.fireWall({ protect: true }),
    commentController.updateMyComment
  )
  .delete(
    authController.fireWall({ protect: true }),
    commentController.deleteMyComment
  );

router
  .route("/")
  .get(helperMiddlewares.passQueryFilter, commentController.readAllComments)
  .post(
    authController.fireWall({ protect: true }),
    authController.restrictTo("admin"),
    commentController.createComment
  );

router.use(
  authController.fireWall({ protect: true }),
  authController.restrictTo("admin")
);

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
