const { Router } = require('express')
const router = Router()

const { check, validationResult } = require('express-validator')

const TaskModel = require('../models/Task')

router.post(
    "/create",
    [
        require('../middleware/isAuth.middleware'),
        check('title', 'Title is required').exists()
    ],
    async (req, res) => {
        try {

            let errors = validationResult(req)

            if (!errors.isEmpty()) {
                return res.status(400).json({
                    errors: errors.array(),
                    message: 'Invalid data'
                })
            }

            const { title, description, deadline, done, owner } = req.body

            const task = new TaskModel({ title, description, deadline, done, owner })

            await task.save()

            return res.status(200).json({ title, description, deadline, done, owner })

        } catch (e) {
            console.log(e)
            return res.status(500).json({ message: "Some error on server..." })
        }
    }
)


router.get(
    "/",
    [
        require('../middleware/isAuth.middleware')
    ],
    async (req, res) => {
        try {

            const task = await TaskModel.find({ owner: req.user.userId }).exec()

            return res.status(200).json({ task })

        } catch (e) {
            console.log(e)
            return res.status(500).json({ message: "Some error on server..." })
        }
    }
)


router.get(
    "/:id",
    [
        require('../middleware/isAuth.middleware'),
        require('../middleware/isTaskOfUser.middleware')
    ],
    async (req, res) => {
        try {

            const task = await TaskModel.find({ _id: req.params.id, owner: req.user.userId })

            return res.status(200).json({ task })

        } catch (e) {
            console.log(e)
            return res.status(500).json({ message: "Some error on server..." })
        }
    }
)


router.post(
    "/update/:id",
    [
        require('../middleware/isAuth.middleware'),
        require('../middleware/isTaskOfUser.middleware')
    ],
    async (req, res) => {
        try {

            const updatedTask = await TaskModel.findOneAndUpdate({ _id: req.params.id, owner: req.user.userId }, req.body)
            return res.status(200).json({ message: 'Successfull updated', task: updatedTask })


            ///const task = await TaskModel.findById(req.params.id)

            //////const {title} = req.body.title || 
            ///const {description}
            //const {deadline}
            //const {done}
            //const {owner}

            //const task = new TaskModel({title, description, deadline, done, owner})

            //await task.save()

        } catch (e) {
            console.log(e)
            return res.status(500).json({ message: "Some error on server..." })
        }
    }
)


router.post(
    "/delete/:id",
    [
        require('../middleware/isAuth.middleware'),
        require('../middleware/isTaskOfUser.middleware')
    ],
    async (req, res) => {
        try {

            await TaskModel.findByIdAndDelete( req.params.id )
            return res.status(200).json({ message: 'Successfull deleted' })


        } catch (e) {
            console.log(e)
            return res.status(500).json({ message: "Some error on server..." })
        }
    }
)



module.exports = router