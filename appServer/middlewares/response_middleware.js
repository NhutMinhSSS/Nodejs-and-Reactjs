const logger = require('../config/logger.config');

const responseMiddleware = (req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
      const responseTime = Date.now() - start;
      logger.info(`[${req.method}] - ${req.ip}${req.originalUrl} - ${res.statusCode} - ${responseTime}ms`);
    });
    next();
}
module.exports = responseMiddleware;