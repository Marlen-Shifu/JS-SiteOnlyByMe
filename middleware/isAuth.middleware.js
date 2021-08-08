const config = require('config')

const jwt = require('jsonwebtoken')

module.exports = async (req, res, next) => {

    try{

        const token = req.headers.authorization.split(' ')[1]

        if (!token) {
            return res.status(401).json({message: "Not authorization"})
        }

        const decoded = jwt.verify(token, config.get('jwt-secret'))
        req.user = decoded

        next()

    } catch (e){
        return res.status(401).json({message: "Not authorization"})
    }

}