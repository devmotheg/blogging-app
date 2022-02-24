/*!
 * @author Mohamed Muntasir
 * @link https://github.com/devmotheg
 */

const express = require("express");
const authController = require("../controllers/auth-controller"),
	viewController = require("../controllers/view-controller");

const router = express.Router();

router.get(
	"/",
	authController.fireWall({ notify: true }),
	viewController.renderRoot
);
router.get(
	"/tags/:tag",
	authController.fireWall({ notify: true }),
	viewController.renderTag
);

router.get(
	"/log-in",
	authController.fireWall({ notify: true, forbid: true }),
	viewController.renderLogIn
);
router.get(
	"/register",
	authController.fireWall({ notify: true, forbid: true }),
	viewController.renderRegister
);

router.get(
	"/create-post",
	authController.fireWall({ protect: true, notify: true }),
	viewController.renderCreatePost
);
router.get(
	"/update-post/:postId",
	authController.fireWall({ protect: true, notify: true }),
	viewController.renderUpdatePost
);

router.get(
	["/settings", "/settings/profile"],
	authController.fireWall({ protect: true, notify: true }),
	viewController.renderProfileSettings
);
router.get(
	"/settings/security",
	authController.fireWall({ protect: true, notify: true }),
	viewController.renderSecuritySettings
);

router.get(
	"/:username",
	authController.fireWall({ notify: true }),
	viewController.renderUser
);
router.get(
	"/:username/:postId",
	authController.fireWall({ notify: true }),
	viewController.renderPost
);

module.exports = router;
