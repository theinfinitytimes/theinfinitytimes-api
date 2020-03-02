const {AuthenticationError} = require('apollo-server-express');
const {UserModel} = require('../../models/user');
const {AccountModel} = require('../../models/account');
const {decodeToken} = require('./auth.middleware');
const userAuth = async req => {
    // Used in resolvers to check if user is authenticated
    // Throws AuthenticationError if user is unauthenticated or unregistered
    const checkAuthentication = async () => {
        if (!req.headers.authorization) {
            throw new AuthenticationError('Unauthenticated');
        }
    };

    let user = {};
    let account = {};
    if (req.headers && req.headers.authorization) {
        const token = (req.headers.authorization.split(" "))[1];
        try {
            const decoded = await decodeToken(token);
            // Update user if JWT was valid
            if (decoded.payload && decoded.payload.sub) {
                const _id = (decoded.payload.sub.split("|"))[1];
                user = await UserModel.findById(_id);
                account = await AccountModel.findOne({user: _id});
                user = {
                    ...user,
                    ...account
                };
            }
        } catch (err) {
            if (process.env.NODE_ENV === 'development') {
                console.log(err)
            }
        }

    }
    return {
        ...user,
        checkAuthentication
    }
};

module.exports = {userAuth};
