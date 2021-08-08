const {model, Schema, Types} = require('mongoose')


const UserSchema = new Schema({
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    username: {type: String, required: true, unique: true},
    tasks: [{type: Types.ObjectId, ref: 'Task'}]
})


module.exports = model('User', UserSchema)