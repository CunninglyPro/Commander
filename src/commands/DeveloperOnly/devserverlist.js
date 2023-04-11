const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const devID = process.env.DeveloperID;

module.exports = {
data: new SlashCommandBuilder()
    .setName('devserverlist')
    .setDescription('DEVELOPER ONLY! Lists all servers the bot is in.'),
async execute(interaction, client) {
    
    // Check if the user is a developer

    const notDev = new EmbedBuilder()
    .setTitle("You are not a developer!")
    .setColor(`Red`)

    if (interaction.user.id !== devID) {
        return interaction.reply({ embeds: [notDev], ephemeral: true})
    }

    // Get the bot's guilds
    const guilds = client.guilds.cache.map(guild => guild.name);
    const guildsString = guilds.join("\n");

    // Create the embed

    const embed = new EmbedBuilder()
    .setTitle("Servers")
    .setDescription(guildsString)
    .setColor(`Green`)

    // Reply with the embed

    interaction.reply({ embeds: [embed] })

    }
};