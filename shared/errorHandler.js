/**
 * Shared Express Error Handler
 * 
 * Classifies errors and returns appropriate HTTP responses.
 * Must be the LAST middleware registered with app.use().
 * 
 * Handles:
 *   - AppError        → returns statusCode + message
 *   - SequelizeUnique → 409 Conflict
 *   - SequelizeValid  → 400 Bad Request
 *   - Unknown         → 500 (never leaks stack to client)
 */

const { logger } = require('./logger');

function errorHandler(err, req, res, _next) {
    // 1. AppError — expected operational error
    if (err.isOperational) {
        return res.status(err.statusCode).json({ error: err.message });
    }

    // 2. Sequelize unique constraint (duplicate email, etc.)
    if (err.name === 'SequelizeUniqueConstraintError') {
        const field = err.errors?.[0]?.path || 'field';
        return res.status(409).json({ error: `Duplicate value for ${field}` });
    }

    // 3. Sequelize validation error (missing required, wrong type, etc.)
    if (err.name === 'SequelizeValidationError') {
        const messages = err.errors?.map((e) => e.message) || ['Validation error'];
        return res.status(400).json({ error: messages.join(', ') });
    }

    // 4. JWT errors
    if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
        return res.status(401).json({ error: 'Invalid or expired token' });
    }

    // 5. Unknown / programming error — log full details, return generic message
    logger.error('Unhandled error', {
        message: err.message,
        stack: err.stack,
        url: req.originalUrl,
        method: req.method,
    });

    return res.status(500).json({ error: 'Internal server error' });
}

module.exports = { errorHandler };
