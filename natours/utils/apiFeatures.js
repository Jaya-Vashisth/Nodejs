class APIFeatures {
  //constructor
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  //filter the query
  filter() {
    // 1A)Filteriting
    const querobj = { ...this.querystring };
    const excludefileds = ['page', 'sort', 'limit', 'fields'];
    excludefileds.forEach((el) => delete querobj[el]);

    //1B) Advanse filtering
    let queryStr = JSON.stringify(querobj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    this.query = this.query.find(JSON.parse(queryStr));

    return this;
  }

  //sort
  sort() {
    if (this.queryString.sort) {
      const sortby = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortby);

      //sort('price ratingsAverage')
    }

    return this;
  }

  //limit the fields
  limitfields() {
    if (this.queryString.fields) {
      const field = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(field);
    }

    return this;
  }

  //pages to be displayed
  paginate() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 100;
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
}

module.exports = APIFeatures;
