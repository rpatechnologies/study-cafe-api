/**
 * Shared Utilities — Single entry point.
 * 
 * Usage from any service:
 *   const { logger, AppError, asyncHandler, errorHandler, createCrudController } = require('../../shared');
 */

const { logger } = require('./logger');
const { AppError } = require('./AppError');
const { asyncHandler } = require('./asyncHandler');
const { errorHandler } = require('./errorHandler');
const { createCrudController } = require('./baseController');
const { paginate } = require('./pagination/paginate');

module.exports = {
    logger,
    AppError,
    asyncHandler,
    errorHandler,
    createCrudController,
    paginate,
};
