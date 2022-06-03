// Models
const { Product } = require('../models/product.model');

// Utils
const { catchAsync } = require('../utils/catchAsync');
const { AppError } = require('../utils/appError');

const productExists = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const product = await Product.findOne({ where: { id, status: 'active' } });

  if (!product) {
    return next(new AppError('Could not find product by given id', 404));
  }

  req.product = product;
  next();
});
const protectProductOwner = catchAsync(async (req, res, next) => {
  // Get current session user and the user that is going to be updated
  const { sessionUser, product } = req;

  // Compare the id's
  if (sessionUser.id !== product.id) {
    // If the ids aren't equal, return error
    return next(new AppError('Usted no creo el producto o la categoria', 403));
  }

  next();
});

module.exports = { productExists, protectProductOwner };
