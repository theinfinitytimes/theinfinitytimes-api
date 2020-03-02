const { userAuth } = require('./userAuth');

module.exports = async (req, res, next) => {
    req.user = await userAuth(req);

    next();
};
