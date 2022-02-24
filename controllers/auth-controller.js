/*!
 * @author Mohamed Muntasir
 * @link https://github.com/devmotheg
 */

const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const User = require("../models/user-model"),
	catchAsync = require("../utils/catch-async"),
	AppError = require("../utils/app-error");

const logUserIn = async (req, res, statusCode, payload) => {
	const token = await promisify(jwt.sign)(payload, process.env.JWT_SECRET, {
		expiresIn: process.env.JWT_EXPIRATION,
	});

	const cookieOptions = {
		expires: new Date(
			Date.now() + process.env.JWT_COOKIE_EXPIRATION * 24 * 60 * 60 * 1000
		),
		httpOnly: true,
		secure:
			req.secure ||
			req.headers("x-forwarded-proto") ||
			process.env.NODE_ENV === "production",
	};

	res.cookie("jwt", token, cookieOptions);
	res.status(statusCode).json({
		status: "success",
		message: "You're now logged in",
	});
};

exports.register = catchAsync(async (req, res, next) => {
	const filteredBody = { ...req.body };
	delete filteredBody.role;

	const newUser = await User.create(filteredBody);

	logUserIn(req, res, 201, { id: newUser.id });
});

exports.logIn = catchAsync(async (req, res, next) => {
	const { username, password } = req.body;

	if (!username || !password)
		return next(new AppError("Either username or password is missing", 400));

	const user = await User.findOne({ username }).select("+password");

	if (!user || !(await user.comparePassword(password, user.password)))
		return next(new AppError("Either username or password is wrong", 401));

	logUserIn(req, res, 200, { id: user.id });
});

exports.logOut = catchAsync(async (req, res, next) => {
	res.cookie("jwt", "", { expires: new Date(Date.now() + 1 * 1000) });
	res.status(200).json({ status: "success", message: "You're now logged out" });
});

exports.fireWall = ({ protect, notify, forbid }) =>
	catchAsync(async (req, res, next) => {
		const { authorization } = req.headers;

		if (authorization && authorization.startsWith("Bearer"))
			var token = authorization.split(" ")[1];
		else if (req.cookies.jwt) var token = req.cookies.jwt;
		else
			return protect
				? next(new AppError("Only logged in users can access this route", 401))
				: next();

		const { id, iat } = await promisify(jwt.verify)(
			token,
			process.env.JWT_SECRET
		);
		const user = await User.findById(id).select("+password");

		if (!user)
			return protect
				? next(new AppError("This user no longer exists", 401))
				: next();

		if (user.passwordChangedAfter(iat))
			return next(
				new AppError("This user changed their password recently", 404)
			);

		if (protect) req.user = user;
		if (notify) res.locals.user = user;

		if (forbid)
			return next(new AppError("Only guests can access this route", 401));

		next();
	});

exports.verify = catchAsync(async (req, res, next) => {
	const { user } = req;
	const { currentPassword } = req.body;

	if (!currentPassword)
		return next(new AppError("Provide the current password", 400));

	if (!(await user.comparePassword(currentPassword, user.password)))
		return next(new AppError("Incorrent current password", 401));

	next();
});

exports.restrictTo = (...roles) => {
	return (req, res, next) => {
		if (!roles.includes(req.user.role))
			return next(
				new AppError("You're not authorized to perform such action", 401)
			);

		next();
	};
};

exports.updateMyPassword = catchAsync(async (req, res, next) => {
	const { newPassword } = req.body;

	if (!newPassword) next(new AppError("Provide your new password", 400));

	req.user.password = newPassword;
	await req.user.save();

	logUserIn(req, res, 200, { id: req.user.id });
});
