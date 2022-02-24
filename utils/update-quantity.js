/*!
 * @author Mohamed Muntasir
 * @link https://github.com/devmotheg
 */

module.exports = ({ updatedModel, localSchema, updatedField, refId }) => {
  localSchema.post("save", async function () {
    const quantity = await this.constructor.count({ [refId]: this[refId] });
    await updatedModel.findByIdAndUpdate(this[refId], {
      [updatedField]: quantity,
    });
  });

  localSchema.pre(/delete/i, async function (next) {
    this.docs = await this.model.find(this._conditions);

    next();
  });

  localSchema.post(/delete/i, async function () {
    this.docs.forEach(async d => {
      const quantity = await d.constructor.count({ [refId]: d[refId] });
      await updatedModel.findByIdAndUpdate(d[refId], {
        [updatedField]: quantity,
      });
    });

    await Promise.all(this.docs);
  });
};
