/**
 * Shared Express Error Handler
 *
 * Classifies errors and returns appropriate HTTP responses.
 * Must be the LAST middleware registered with app.use().
 *
 * All error responses follow the envelope:
 *   { success: false, error: "message", details?: [...] }
 *
 * Handles:
 *   - AppError          → returns statusCode + message
 *   - Joi Validation    → 400 with field-level details
 *   - SequelizeUnique   → 409 Conflict
 *   - SequelizeValid    → 400 Bad Request
 *   - SequelizeForeignKey → 400 Bad Request (invalid reference)
 *   - JWT errors        → 401 Unauthorized
 *   - Axios errors      → forwards upstream status + message
 *   - Unknown           → 500 (never leaks stack to client)
 */

const { logger } = require('./logger');

function errorHandler(err, req, res, _next) {
    // 1. AppError — expected operational error
    if (err.isOperational) {
        const body = { success: false, error: err.message };
        if (err.details) body.details = err.details;
        return res.status(err.statusCode).json(body);
    }

    // 2. Joi ValidationError (if thrown directly, not via validate middleware)
    if (err.isJoi || err.name === 'ValidationError') {
        const details =
            err.details?.map((d) => ({
                field: d.path?.join('.') || 'unknown',
                message: d.message,
            })) || [];
        const msg = details.map((d) => d.message).join('; ') || err.message;
        return res.status(400).json({ success: false, error: msg, details });
    }

    // 3. Sequelize unique constraint (duplicate email, etc.)
    if (err.name === 'SequelizeUniqueConstraintError') {
        const field = err.errors?.[0]?.path || 'field';
        return res.status(409).json({ success: false, error: `Duplicate value for ${field}` });
    }

    // 4. Sequelize validation error (missing required, wrong type, etc.)
    if (err.name === 'SequelizeValidationError') {
        const messages = err.errors?.map((e) => e.message) || ['Validation error'];
        return res.status(400).json({ success: false, error: messages.join(', ') });
    }

    // 5. Sequelize foreign key constraint
    if (err.name === 'SequelizeForeignKeyConstraintError') {
        return res.status(400).json({ success: false, error: 'Invalid reference — related record not found' });
    }

    // 6. JWT errors
    if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
        return res.status(401).json({ success: false, error: 'Invalid or expired token' });
    }

    // 7. Axios errors (admin-service proxy failures)
    if (err.isAxiosError) {
        const status = err.response?.status || 502;
        const upstream = err.response?.data;
        const message =
            (typeof upstream === 'object' && upstream?.error) ||
            (typeof upstream === 'string' && upstream) ||
            'Upstream service error';
        return res.status(status).json({ success: false, error: message });
    }

    // 8. Unknown / programming error — log full details, return generic message
    logger.error('Unhandled error', {
        message: err.message,
        stack: err.stack,
        url: req.originalUrl,
        method: req.method,
    });

    return res.status(500).json({ success: false, error: 'Internal server error' });
}

module.exports = { errorHandler };
