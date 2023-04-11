const mongoose = require("mongoose")
const mongodbURL = process.env.MongoDB;
const {ActivityType} = require(`discord.js`)

module.exports = {
    name: 'ready',
    once: true,
    async execute(client) {
        console.log(`Sucessfully connected to ${client.user.tag}.`);

        await mongoose.set('strictQuery', true)

        if (!mongodbURL) return;

        await mongoose.connect(mongodbURL || '', {
            keepAlive: true,
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })

        if (mongoose.connect) {
            console.log("Sucessfully connected application to MongoDB.")
        }
    },
};