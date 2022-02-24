/*!
 * @author Mohamed Muntasir
 * @link https://github.com/devmotheg
 */

module.exports = class {
  constructor(searchQuery, queryObj) {
    this.searchQuery = searchQuery;
    this.queryObj = queryObj;
  }

  filter() {
    const queryObjCopy = JSON.parse(
      JSON.stringify(this.queryObj).replace(
        /\blt|lte|gt|gte\b/g,
        match => `$${match}`
      )
    );

    for (const specialField of ["sort", "limit", "page"])
      delete queryObjCopy[specialField];

    this.searchQuery.find(queryObjCopy);

    return this;
  }

  sort() {
    if (this.queryObj.sort) this.searchQuery.sort(this.queryObj.sort);
    else this.searchQuery.sort("-createdAt");

    return this;
  }

  paginate() {
    const limit = this.queryObj.limit || 50,
      page = this.queryObj.page || 1;

    this.searchQuery.limit(limit).skip((page - 1) * limit);

    return this;
  }
};
