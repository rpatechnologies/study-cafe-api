const { asyncHandler } = require('./asyncHandler');
const { AppError } = require('./AppError');
const { logger } = require('./logger');

function createCrudController(service, { resourceName = 'Resource' } = {}) {
    return {
        list: asyncHandler(async (req, res) => {
            const result = await service.list(req.query);
            res.json(result);
        }),

        getOne: asyncHandler(async (req, res) => {
            const id = parseId(req.params.id);
            const item = await service.getOne(id);
            if (!item) throw new AppError(`${resourceName} not found`, 404);
            res.json(item);
        }),

        create: asyncHandler(async (req, res) => {
            const item = await service.create(req.body);
            logger.info(`${resourceName} created`, { id: item.id });
            res.status(201).json(item);
        }),

        update: asyncHandler(async (req, res) => {
            const id = parseId(req.params.id);
            const item = await service.update(id, req.body);
            if (!item) throw new AppError(`${resourceName} not found`, 404);
            logger.info(`${resourceName} updated`, { id });
            res.json(item);
        }),

        remove: asyncHandler(async (req, res) => {
            const id = parseId(req.params.id);
            const deleted = await service.remove(id);
            if (!deleted) throw new AppError(`${resourceName} not found`, 404);
            logger.info(`${resourceName} deleted`, { id });
            res.status(204).send();
        }),
    };
}

function parseId(raw) {
    const id = parseInt(raw, 10);
    if (Number.isNaN(id)) throw new AppError('Invalid id', 400);
    return id;
}

module.exports = { createCrudController };
