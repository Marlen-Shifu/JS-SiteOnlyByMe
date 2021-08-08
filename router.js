const {Router} = require('express')

const router = Router()

router.get(
    "",
    require('./middleware/isAuth.middleware'),
    async (req, res) => {
        try{
            const text = req.query.text

            return res.status(200).json({text})
        } catch (e) {
            return res.status(500).json({message: e.message})
        }
    }
)


module.exports = router