const TaskModel = require('../models/Task')

module.exports = async (req, res, next) => {

    try {

        const task = await TaskModel.findOne({ _id: req.params.id })

        if (!task){
            return res.status(404).json({ message: "Not founded" })
        }

        if (task.owner == req.user.userId) {
            next()
        }
        else {
            return res.status(403).json({ message: "Permission denied" })
        }

    } catch (e) {
        console.log(e)
        return res.status(403).json({ message: "Permission denied" })
    }

}