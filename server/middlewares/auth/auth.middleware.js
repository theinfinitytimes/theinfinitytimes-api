const dotenv = require('dotenv');
dotenv.config();
const jwksClient = require('jwks-rsa');

const secretProvider = jwksClient({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`
});


const jsonwt = require('jsonwebtoken');


const getSecret = async kid => new Promise((resolve, reject) => {
    secretProvider.getSigningKey(kid, (err, key) => {
        if (err) {
            reject(err)
        } else {
            const publicKey = key.publicKey || key.rsaPublicKey;
            resolve(publicKey)
        }
    })
});

const verifyToken = async (token, dtoken) => jsonwt.verify(
    token,
    await getSecret(dtoken.header.kid),
    {
        audience: process.env.AUTH0_AUDIENCE,
        issuer: `https://${process.env.AUTH0_DOMAIN}/`,
        algorithms: ['RS256']
    }
);

module.exports.decodeToken = async token => {
    // Decode JWT without verification to get kid from header
    // Error is thrown if decoding or verification fails
    const decoded = jsonwt.decode(token, { complete: true }) || {};
    await verifyToken(token, decoded);

    return decoded
};
