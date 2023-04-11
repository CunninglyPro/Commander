const { SlashCommandBuilder, EmbedBuilder} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("serverinfo")
    .setDescription("Find the information of current discord server."),

  async execute(interaction) {
    const { guild }= interaction;
    const { members } = guild;
    const { name, ownerId, createdTimestamp, memberCount } = guild;
    const icon = guild.iconURL() || `https://e1.pngegg.com/pngimages/373/977/png-clipart-discord-for-macos-white-and-blue-logo-art.png`
    const roles = guild.roles.cache.size;
    const emojis = guild.emojis.cache.size;
    const id = guild.id

    let baseVerification = guild.verificationLevel

    if (baseVerification == 0) baseVerification = "None"
    if (baseVerification == 1) baseVerification = "Low"
    if (baseVerification == 2) baseVerification = "Medium"
    if (baseVerification == 3) baseVerification = "High"
    if (baseVerification == 4) baseVerification = "Very High"

    const response = new EmbedBuilder()
      .setColor("Blue")
      .setAuthor({ name: name, iconURL: icon })
      .setThumbnail(icon)
      .addFields(
        { name: "Server Owner", value: `<@${ownerId}>`, inline: true },
        { name: "Server Members", value: `${memberCount}`, inline: true },
        { name: "Date Created", value: `<t:${parseInt(createdTimestamp / 1000)}:R>`, inline: true },
        { name: "Server Boosts", value: `${guild.premiumSubscriptionCount}`, inline: true },
        { name: "Verification Level", value: `${baseVerification}`, inline: true },
        { name: "Available Emojis", value: `${emojis}`, inline: true }
      )
      .setFooter({ text: `Server ID: ${id}`})
      .setImage(guild.bannerURL());

    await interaction.reply({ embeds: [response] }).catch((err) => {
      console.log(err);
    });
  },
};
