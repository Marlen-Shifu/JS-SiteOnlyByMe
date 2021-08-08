const express = require('express')
const mongoose = require('mongoose')
const config = require('config')

const app = express()

app.use(express.json({ extended: true }))

app.use("/", require("./router"))

app.use("/user", require("./routers/UserRouter"))

app.use("/task", require("./routers/TaskRouter"))

const PORT = config.get('port') || 5050

async function start () {

    try{

        await mongoose.connect(config.get('mongoUri'),
        {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false
        })

        app.listen(PORT, () => {
            console.log('Server started at port ' + PORT)
        })

    } catch (e) {
        console.log('Error: ' + e.message)
        process.exit(1)
    }
}

start()