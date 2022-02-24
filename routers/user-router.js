/*!
 * @author Mohamed Muntasir
 * @link https://github.com/devmotheg
 */

const express = require("express");
const postRouter = require("../routers/post-router"),
  favoriteRouter = require("../routers/favorite-router"),
  bookmarkRouter = require("../routers/bookmark-router"),
  commentRouter = require("../routers/comment-router"),
  authController = require("../controllers/auth-controller"),
  userController = require("../controllers/user-controller"),
  helperMiddlewares = require("../utils/helper-middlewares");

const router = express.Router();

router.use("/:username/posts", postRouter);
router.use("/:username/favorites", favoriteRouter);
router.use("/:username/bookmarks", bookmarkRouter);
router.use("/:username/comments", commentRouter);

router.post(
  "/register",
  authController.fireWall({ forbid: true }),
  authController.register
);
router.post(
  "/log-in",
  authController.fireWall({ forbid: true }),
  authController.logIn
);

router.get("/log-out", authController.logOut);

router.use(authController.fireWall({ protect: true }));

router.patch(
  "/update-my-information",
  userController.passFilteredBody("update"),
  userController.updateMyInformation
);

router.patch(
  "/update-my-password",
  authController.verify,
  authController.updateMyPassword
);

router.use(authController.restrictTo("admin"));

router
  .route("/")
  .get(helperMiddlewares.passQueryFilter, userController.readAllUsers)
  .post(userController.passFilteredBody("create"), userController.createUser);

router
  .route("/:id")
  .get(helperMiddlewares.passQueryFilter, userController.readUser)
  .patch(
    helperMiddlewares.passQueryFilter,
    userController.passFilteredBody("update"),
    userController.updateUser
  )
  .delete(helperMiddlewares.passQueryFilter, userController.deleteUser);

module.exports = router;
