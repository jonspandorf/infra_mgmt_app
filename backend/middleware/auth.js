const jwt = require("jsonwebtoken");
const CustomError = require("../models/error");


const checkAuthentication = (req, res, next) => {
    try {
        const { authorization } = req.headers;
        const token = authorization.replace('Bearer', '');
        if (!token ) {
           console.log(authorization)
           throw new CustomError('Must Provide Authorization Error', 401)
        }
        jwt.verify(token, process.env.TOKEN_KEY, async (err, decoded) => {
            if (err) {
                throw new CustomError('Invalid Token', 401)
            }
            const userId = decoded.userId
            req.user = decoded;
            req.user.userId = userId;
            next();
        })

    } catch (err) {
        return next(err)
    }
}

const generateToken = (userId, email) => {
    const token = jwt.sign(
        { userId, email },
        process.env.TOKEN_KEY,
        {
            expiresIn: "6h",
        }
    )
    return token;
}

exports.checkAuthentication = checkAuthentication
exports.generateToken = generateToken 
