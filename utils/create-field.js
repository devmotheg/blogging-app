/*!
 * @author Mohamed Muntasir
 * @link https://github.com/devmotheg
 */

const { SchemaTypes } = require("mongoose");

module.exports = ({ model, type, name, unique, required, min, max }) => {
  if (type === "info") {
    const field = { type: SchemaTypes.String, unique };

    if (required)
      Object.assign(field, {
        required: [true, `A ${model} must have a ${name}`],
      });
    if (min)
      Object.assign(field, {
        minlength: [min, `Minimum length of a ${model} ${name} is ${min}`],
      });
    if (max)
      Object.assign(field, {
        maxlength: [max, `Maximum length of a ${model} ${name} is ${max}`],
      });

    return field;
  }

  if (type === "summary")
    return {
      type: SchemaTypes.Number,
      default: 0,
      min: [0, `Minimum number of ${name} for a ${model} is 0`],
    };
};
