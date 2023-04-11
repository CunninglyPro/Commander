const { model, Schema } = require(`mongoose`)

let chataiSchema = new Schema({
    Guild: String,
    Channel: String,
})

module.exports = model("chataiSchema", chataiSchema)