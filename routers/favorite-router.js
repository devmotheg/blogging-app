/*!
 * @author Mohamed Muntasir
 * @link https://github.com/devmotheg
 */

const express = require("express");
const authController = require("../controllers/auth-controller"),
	favoriteController = require("../controllers/favorite-controller"),
	helperMiddlewares = require("../utils/helper-middlewares");

const router = express.Router({ mergeParams: true });

router
	.route("/my-favorite")
	.post(
		authController.fireWall({ protect: true }),
		favoriteController.createMyFavorite
	)
	.delete(
		authController.fireWall({ protect: true }),
		favoriteController.deleteMyFavorite
	);

router
	.route("/")
	.get(
		helperMiddlewares.passQueryFilter,
		helperMiddlewares.setUserId,
		favoriteController.readAllFavorites
	)
	.post(
		authController.fireWall({ protect: true }),
		authController.restrictTo("admin"),
		favoriteController.createFavorite
	);

router.use(
	authController.fireWall({ protect: true }),
	authController.restrictTo("admin")
);

router
	.route("/:id")
	.get(helperMiddlewares.passQueryFilter, favoriteController.readFavorite)
	.delete(helperMiddlewares.passQueryFilter, favoriteController.deleteFavorite);

module.exports = router;
