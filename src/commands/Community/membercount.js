const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
 
module.exports = {
    data: new SlashCommandBuilder()
        .setName('membercount')
        .setDescription('Get the server member count'),
    async execute(interaction) {

        const message = new EmbedBuilder()
        .setAuthor({name: `${interaction.guild.name} has ${interaction.guild.memberCount} members.`, iconURL: `https://cdn4.iconfinder.com/data/icons/small-n-flat/24/user-512.png`})
        .setColor('Green')

        await interaction.reply({ embeds: [message] });
    }
}