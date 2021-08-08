const {Router} = require('express')
const router = Router()

const {check, validationResult} = require('express-validator')

const bcrypt = require('bcryptjs')

const config = require('config')

const jwt = require('jsonwebtoken')

const UserModel = require('../models/User')

router.post(
    "/register",
    [
        check('email', 'Invalid email').isEmail(),
        check('username', 'Username required').exists(),
        check('password', 'Password length will be less 8').exists().isLength({min: 8})
    ],
    async (req, res) => {
        try{

            let errors = validationResult(req)

            if (!errors.isEmpty()) {
                return res.status(400).json({
                    errors: errors.array(),
                    message: 'Invalid data'
                })
            }

            const {username, email, password} = req.body

            const existUserWithUsername = await UserModel.findOne({username})

            if (existUserWithUsername) {
                return res.status(400).json({
                    message: 'User with this username already exists'
                })
            }

            const existUserWithEmail = await UserModel.findOne({email})

            if (existUserWithEmail) {
                return res.status(400).json({
                    message: 'User with this email already exists'
                })
            }

            const hashedPassword = await bcrypt.hash(password, 12)

            const user = new UserModel({username: username, email: email, password: hashedPassword})

            await user.save()

            return res.status(201).json({message: 'User have been created'})

        } catch (e) {
            console.log(e)
            return res.status(500).json({message: e.message})
        }
    }
)


router.post(
    "/login",
    
    [
        check('email', 'Invalid data').normalizeEmail().isEmail(),
        check('password', 'Invalid data')
            .isLength({min: 8}).exists()
    ],

    async (req, res) => {

        
        try {
    
            const errors = validationResult(req)
        
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    errors: errors.array(),
                    message: 'Invalid data'
                })
            }
    
            const {email, password} = req.body;

            const user = await UserModel.findOne({ email })

            if (!user) {
                return res.status(400).json({message: "User with this email does not exists"})
            }

            const isMatch = await bcrypt.compare(password, user.password)
            
            if (!isMatch) {
                return res.status(400).json('Incorrect password')
            }

            const token = jwt.sign(
                { userId: user.id },
                config.get('jwt-secret'),
                { expiresIn: '1d' }
            )

            res.json({ token, userId: user.id })

            `{
                "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2MTAxMTdmZmY1ZjliMDA0YjA3MmExYTEiLCJpYXQiOjE2Mjc2MzYzOTMsImV4cCI6MTYyNzcyMjc5M30.NZrToxSFPA62XgJxJLNXR9xuH5Dnee6Nk-70fP_vQR0",
                "userId": "610117fff5f9b004b072a1a1"
            }`

        } catch (e) {
            console.log(e.message)
            res.status(500).json({"message": "Some error on server, try again..."})
        }

})


module.exports = router