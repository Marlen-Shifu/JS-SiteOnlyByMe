const {model, Schema, Types} = require('mongoose')


const TaskSchema = new Schema({
    title: {type: String, required: true},
    description: {type: String},
    deadline: {type: Date, default: ""},
    done: {type: Boolean, default: false},
    owner: {type: Types.ObjectId, ref: 'User'}
})


module.exports = model('Task', TaskSchema)