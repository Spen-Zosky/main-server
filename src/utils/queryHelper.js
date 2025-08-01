/**
 * Build MongoDB filter object from query parameters
 */
const buildFilter = (conditions) => {
  const filter = {};
  
  Object.entries(conditions).forEach(([key, condition]) => {
    if (condition && typeof condition === 'object') {
      Object.assign(filter, condition);
    } else if (condition) {
      filter[key] = condition;
    }
  });
  
  return filter;
};

/**
 * Paginate results
 */
const paginate = async (model, filter = {}, options = {}) => {
  const {
    page = 1,
    limit = 20,
    sort = { createdAt: -1 },
    populate = []
  } = options;

  const skip = (page - 1) * limit;

  let query = model.find(filter).sort(sort).skip(skip).limit(limit);

  // Apply population
  if (populate.length > 0) {
    populate.forEach(pop => {
      query = query.populate(pop);
    });
  }

  const [docs, totalDocs] = await Promise.all([
    query.exec(),
    model.countDocuments(filter)
  ]);

  const totalPages = Math.ceil(totalDocs / limit);
  const hasNextPage = page < totalPages;
  const hasPrevPage = page > 1;

  return {
    docs,
    totalDocs,
    limit,
    page,
    totalPages,
    hasNextPage,
    hasPrevPage,
    nextPage: hasNextPage ? page + 1 : null,
    prevPage: hasPrevPage ? page - 1 : null
  };
};

module.exports = {
  buildFilter,
  paginate
};