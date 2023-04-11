const { Events, EmbedBuilder } = require("discord.js");

module.exports = {
  name: "messageCreate",
  once: false,
  async execute(message, client) {
    if (!message.guild || message.author.bot) return;
    if (message.content.match(RegExp(`^<@!?${client.user.id}>$`))) {
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("Blue")
            .setThumbnail(client.user.avatarURL({ dynamic: true }))
            .setDescription(
              `Hello, I am **${client.user.username}**. A discord bot based on [open source Commander](https://github.com/Antinity/Commander) project, which is a powerful Discord bot written in JavaScript and Node.js, and Discord.js v14 library, created by the YouTuber Antinity. This bot is designed to enhance your Discord server experience by providing a wide range of features and commands for managing, moderating, and customizing your server. Use \`/help\` command to get a list of all commands.`)
              .addFields({ name: `Total Commands`, value: `${client.commands.size}`, inline: true },
              { name: `Total Servers`, value: `${client.guilds.cache.size}`, inline: true },
              { name: `Total Members`, value: `${client.users.cache.size}`, inline: true },)
        ],
      });
    }
  },
};
