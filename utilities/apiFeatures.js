class ApiFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }
  filtering() {
    const objQuery = { ...this.queryString };
    const excludedFields = ['sort', 'page', 'limit', 'fields'];
    excludedFields.forEach((element) => {
      delete objQuery[element];
    });

    let queryString = JSON.stringify(objQuery);
    queryString = queryString.replace(
      /\b(gte|lt|gt|lte)\b/g,
      (match) => `$${match}`
    );
    this.query = this.query.find(JSON.parse(queryString));
    return this;
  }
  sorting() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-createdAt _id');
    }
    return this;
  }
  fields() {
    if (this.queryString.fields) {
      const field = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(field);
    } else {
      this.query = this.query.select('-__v');
    }
    return this;
  }
  pagination() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 100;
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}
module.exports = ApiFeatures;
