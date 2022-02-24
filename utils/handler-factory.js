/*!
 * @author Mohamed Muntasir
 * @link https://github.com/devmotheg
 */

const APIFeatures = require("./api-features"),
  catchAsync = require("./catch-async"),
  notFoundError = require("./not-found-error");

exports.useFactory = (handlerFactory, Model, name) => action =>
  handlerFactory[action](Model, name);

exports.readAll = (Model, name) =>
  catchAsync(async (req, res, next) => {
    const { searchQuery } = new APIFeatures(
      Model.find(req.queryFilter),
      req.query
    )
      .filter()
      .sort()
      .paginate();

    const docs = await searchQuery;

    res.status(200).json({
      status: "success",
      length: docs.length,
      data: { [`${name}s`]: docs },
    });
  });

exports.createOne = (Model, name) =>
  catchAsync(async (req, res, next) => {
    const newDoc = await Model.create(req.filteredBody || req.body);
    res.status(201).json({
      status: "success",
      data: { [name]: newDoc },
    });
  });

exports.readOne = (Model, name) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findOne(req.queryFilter);

    if (!doc) return notFoundError(name, next);

    res.status(200).json({
      status: "success",
      data: { [name]: doc },
    });
  });

exports.updateOne = (Model, name) =>
  catchAsync(async (req, res, next) => {
    const updatedDoc = await Model.findOneAndUpdate(
      req.queryFilter,
      req.filteredBody,
      {
        runValidators: true,
        new: true,
      }
    );

    if (!updatedDoc) return notFoundError(name, next);

    res.status(200).json({
      status: "success",
      data: { [name]: updatedDoc },
    });
  });

exports.deleteOne = (Model, name) =>
  catchAsync(async (req, res, next) => {
    const deletedDoc = await Model.findOneAndDelete(req.queryFilter);

    if (!deletedDoc) return notFoundError(name, next);

    res.status(204).json({ status: "success" });
  });
