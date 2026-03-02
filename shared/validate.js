/**
 * Joi validation middleware factory.
 *
 * Usage in routes:
 *   const { validate } = require('../../../../shared');
 *   router.post('/foo', validate(fooSchema), controller.foo);
 *
 * The schema object can have keys: body, query, params.
 * On failure an AppError (400) is thrown with the validation details.
 * On success the sanitized (stripped of unknowns) values replace
 * req.body / req.query / req.params.
 */

const { AppError } = require('./AppError');

function validate(schema) {
    return (req, _res, next) => {
        const errors = [];

        for (const source of ['body', 'query', 'params']) {
            if (!schema[source]) continue;

            const { error, value } = schema[source].validate(req[source], {
                abortEarly: false,
                stripUnknown: true,
                convert: true,
            });

            if (error) {
                errors.push(
                    ...error.details.map((d) => ({
                        field: d.path.join('.'),
                        message: d.message,
                    }))
                );
            } else {
                req[source] = value;
            }
        }

        if (errors.length) {
            const msg = errors.map((e) => e.message).join('; ');
            const err = new AppError(msg, 400);
            err.details = errors;
            return next(err);
        }

        next();
    };
}

module.exports = { validate };
