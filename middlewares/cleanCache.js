const { clearHash } = require('../services/cache');

module.exports = async (req, res, next) => {
  // Allow the handler to run first.
  await next();
  // Clear our cache after it's all done.
  clearHash(req.user.id);
};
