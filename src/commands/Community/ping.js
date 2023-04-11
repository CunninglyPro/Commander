const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js')
const wait = require('node:timers/promises').setTimeout;

module.exports = {
    data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription(`Find out your ping.`),
    async execute(interaction, client) {

        const ping = Date.now() - interaction.createdTimestamp
        const apiping = Math.round(client.ws.ping)

        const pingEmbed = new EmbedBuilder()
        .setColor('Blurple')
        .setAuthor({name: `PING`, iconURL: `https://cdn-icons-png.flaticon.com/512/93/93158.png`})
        .setDescription(`:hourglass: **Your Ping:** ${ping} ms \n:sparkles: **API Delay:** ${apiping} ms`)
        
         await interaction.deferReply();
         await interaction.editReply({ embeds: [pingEmbed] });
    }

}