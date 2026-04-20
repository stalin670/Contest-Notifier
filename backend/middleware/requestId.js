const { nanoid } = require("nanoid");

const requestId = (req, res, next) => {
    const id = req.headers["x-request-id"] || nanoid(10);
    req.id = id;
    res.setHeader("x-request-id", id);
    next();
};

module.exports = { requestId };
