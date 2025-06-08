const jwt = require('jsonwebtoken');
require('dotenv').config()
module.exports = {
    authorize: (req, res, next) => {
        let token = req.headers['token']
       
        if (token) {

            jwt.verify(token, process.env.JWT_SECRET_KEY, (err, authData) => {
                if (err) {
                    return res.status(401).json({
                        isValid: false,
                        message: 'Your Provided Token is not Valid'
                    })
                }
                req.authData = authData
                next();
            })

        } else {
            return res.status(401).json({
                isValid: false,
                message: "Please provide the authorization token."
            })
        }


    }
}