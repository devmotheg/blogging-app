/*!
 * @author Mohamed Muntasir
 * @link https://github.com/devmotheg
 */

const express = require("express");
const authController = require("../controllers/auth-controller"),
  bookmarkController = require("../controllers/bookmark-controller"),
  helperMiddlewares = require("../utils/helper-middlewares");

const router = express.Router({ mergeParams: true });

router
  .route("/my-bookmark")
  .post(
    authController.fireWall({ protect: true }),
    bookmarkController.createMyBookmark
  )
  .delete(
    authController.fireWall({ protect: true }),
    bookmarkController.deleteMyBookmark
  );

router
  .route("/")
  .get(
    helperMiddlewares.passQueryFilter,
    helperMiddlewares.setUserId,
    bookmarkController.readAllBookmarks
  )
  .post(
    authController.fireWall({ protect: true }),
    authController.restrictTo("admin"),
    bookmarkController.createBookmark
  );

router.use(
  authController.fireWall({ protect: true }),
  authController.restrictTo("admin")
);

router
  .route("/:id")
  .get(helperMiddlewares.passQueryFilter, bookmarkController.readBookmark)
  .delete(helperMiddlewares.passQueryFilter, bookmarkController.deleteBookmark);

module.exports = router;
