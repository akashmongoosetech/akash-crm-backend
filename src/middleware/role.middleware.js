const { forbiddenResponse } = require('../utils/responseHandler');

const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return forbiddenResponse(res, 'User not authenticated');
    }

    if (!roles.includes(req.user.role)) {
      return forbiddenResponse(res, `Role '${req.user.role}' is not authorized to access this route`);
    }

    next();
  };
};

module.exports = { authorize: authorizeRoles };