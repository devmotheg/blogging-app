/*!
 * @author Mohamed Muntasir
 * @link https://github.com/devmotheg
 */

const { SchemaTypes } = require("mongoose");

module.exports = (localModel, foreignModel, required = false) => {
  if (required)
    required = [true, `A ${localModel} must belong to a ${foreignModel.name}`];

  return {
    type: SchemaTypes.ObjectId,
    ref: `${foreignModel.name[0].toUpperCase()}${foreignModel.name.slice(1)}`,
    required: required,
    validate: {
      validator: async id => !!(await foreignModel.Model.findById(id)),
      message: `Invalid ${foreignModel.name} ID`,
    },
  };
};
