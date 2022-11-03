/*!
 * @author Mohamed Muntasir
 * @link https://github.com/devmotheg
 */

const User = require("../models/user-model"),
	handlerFactory = require("../utils/handler-factory"),
	catchAsync = require("../utils/catch-async");

const factory = handlerFactory.useFactory(handlerFactory, User, "user");

exports.passFilteredBody = operation => (req, res, next) => {
	req.filteredBody = { ...req.body };
	delete req.filteredBody.role;

	if (operation === "update") delete req.password;

	next();
};

exports.updateMyInformation = catchAsync(async (req, res, next) => {
	await User.findByIdAndUpdate(req.user.id, req.filteredBody);

	res.status(200).json({
		status: "success",
		message: "You may use your new credentials anytime now",
	});
});

exports.readAllUsers = factory("readAll");
exports.createUser = factory("createOne");
exports.readUser = factory("readOne");
exports.updateUser = factory("updateOne");
exports.deleteUser = factory("deleteOne");
