/*!
 * @author Mohamed Muntasir
 * @link https://github.com/devmotheg
 */

const express = require("express");
const authController = require("../controllers/auth-controller"),
  bookmarkController = require("../controllers/bookmark-controller"),
  helperMiddlewares = require("../utils/helper-middlewares");

const router = express.Router({ mergeParams: true });

router.use(authController.fireWall({ protect: true }));

router
  .route("/my-bookmark")
  .post(bookmarkController.createMyBookmark)
  .delete(bookmarkController.deleteMyBookmark);

router
  .route("/")
  .get(helperMiddlewares.passQueryFilter, bookmarkController.readAllBookmarks)
  .post(authController.restrictTo("admin"), bookmarkController.createBookmark);

router.use(authController.restrictTo("admin"));

router
  .route("/:id")
  .get(helperMiddlewares.passQueryFilter, bookmarkController.readBookmark)
  .delete(helperMiddlewares.passQueryFilter, bookmarkController.deleteBookmark);

module.exports = router;
