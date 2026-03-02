/**
 * Standard API response helpers.
 *
 * Every route sends responses through these helpers so all clients
 * see the same envelope:
 *
 *   Success → { success: true, data: ... }
 *   Created → { success: true, data: ... }  (201)
 *   Paginated → { success: true, data: [...], meta: {...} }
 *   No Content → 204    (no body)
 */

function sendSuccess(res, data, statusCode = 200) {
    return res.status(statusCode).json({ success: true, data });
}

function sendCreated(res, data) {
    return res.status(201).json({ success: true, data });
}

function sendNoContent(res) {
    return res.status(204).send();
}

function sendPaginated(res, { data, meta }) {
    return res.json({ success: true, data, meta });
}

module.exports = { sendSuccess, sendCreated, sendNoContent, sendPaginated };
