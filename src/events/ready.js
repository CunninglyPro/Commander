const mongoose = require("mongoose")
const mongodbURL = process.env.MONGODBURL;
const {ActivityType} = require(`discord.js`)

module.exports = {
    name: 'ready',
    once: true,
    async execute(client) {
        console.log(`Sucessfully logged in as ${client.user.tag}.`);

        await mongoose.set('strictQuery', true)

        if (!mongodbURL) return;

        await mongoose.connect(mongodbURL || '', {
            keepAlive: true,
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })

        if (mongoose.connect) {
            console.log("Sucessfully connected to MongoDB")
        }

        const statusArray = [
            {
                type: ActivityType.Watching,
                text: "your every move 👀",
                status: "idle",
            },
            {
                type: ActivityType.Competing,
                text: "for your attention ⚔️",
                status: "idle",
            },
            {
                type: ActivityType.Listening,
                text: "to your commands 🎧",
                status: "idle",
            },
            {
                type: ActivityType.Playing,
                text: "hide and seek 🕵️‍♂️",
                status: "idle",
            },
            {
                type: ActivityType.Watching,
                text: "you guys chat 🧐",
                status: "idle",
            },
            {
                type: ActivityType.Listening,
                text: "to your feedback 🤔",
                status: "idle",
            },
            {
                type: ActivityType.Playing,
                text: "with new features 😎",
                status: "idle",
            },
            {
                type: ActivityType.Watching,
                text: `${client.guilds.cache.size} servers 📡`
            }
        ];

        setInterval(() => {
            const option = Math.floor(Math.random() * statusArray.length);

            client.user.setPresence({
                activities: [
                    {
                        name: statusArray[option].text,
                        type: statusArray[option].type,

                    },

                ],

                status: statusArray[option].status
            })
        }, 15000);
        console.log(`Sucessfully enabled activity.`)
    },
};