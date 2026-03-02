const { asyncHandler } = require('./asyncHandler');
const { AppError } = require('./AppError');
const { logger } = require('./logger');
const { sendSuccess, sendCreated, sendPaginated, sendNoContent } = require('./responseHelper');

function createCrudController(service, { resourceName = 'Resource' } = {}) {
    return {
        list: asyncHandler(async (req, res) => {
            const result = await service.list(req.query);
            if (result && typeof result === 'object' && ('meta' in result || 'pages' in result)) {
                const meta = result.meta || {
                    total: result.total,
                    page: result.page,
                    limit: result.limit,
                    totalPages: result.pages || Math.ceil(result.total / result.limit) || 0
                };
                return sendPaginated(res, { data: result.data || result, meta });
            }
            sendSuccess(res, result);
        }),

        getOne: asyncHandler(async (req, res) => {
            const id = parseId(req.params.id);
            const item = await service.getOne(id);
            if (!item) throw new AppError(`${resourceName} not found`, 404);
            sendSuccess(res, item);
        }),

        create: asyncHandler(async (req, res) => {
            const item = await service.create(req.body);
            logger.info(`${resourceName} created`, { id: item.id });
            sendCreated(res, item);
        }),

        update: asyncHandler(async (req, res) => {
            const id = parseId(req.params.id);
            const item = await service.update(id, req.body);
            if (!item) throw new AppError(`${resourceName} not found`, 404);
            logger.info(`${resourceName} updated`, { id });
            sendSuccess(res, item);
        }),

        remove: asyncHandler(async (req, res) => {
            const id = parseId(req.params.id);
            const deleted = await service.remove(id);
            if (!deleted) throw new AppError(`${resourceName} not found`, 404);
            logger.info(`${resourceName} deleted`, { id });
            sendNoContent(res);
        }),
    };
}

function parseId(raw) {
    const id = parseInt(raw, 10);
    if (Number.isNaN(id)) throw new AppError('Invalid id', 400);
    return id;
}

module.exports = { createCrudController };
