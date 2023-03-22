const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, PermissionFlagsBits, PermissionsBitField, ChannelType, ActionRowBuilder, SelectMenuBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const ticketSchema = require(`../../Schemas.js/ticketSchema`);

module.exports = {

    data: new SlashCommandBuilder()
    .setName('ticket-remove')
    .setDescription('Shutdown ticket creation counter.')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),

    async execute (interaction, client) {

        const noPerms = new EmbedBuilder()
        .setAuthor({name: `Error!`, iconURL: `https://cdn0.iconfinder.com/data/icons/shift-interfaces/32/Error-512.png`})
        .setDescription(`You are not allowed to use ticket-remove command.`)
        .setColor('DarkRed')

        const sucess = new EmbedBuilder()
        .setAuthor({name: `Ticket creation counter has sucessfuly shut down.`, iconURL: `https://upload.wikimedia.org/wikipedia/commons/thumb/c/c6/Sign-check-icon.png/800px-Sign-check-icon.png`})
        .setColor('Green')

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) return await interaction.reply({ embeds: [noPerms], ephemeral: true });

        ticketSchema.deleteMany({ Guild: interaction.guild.id }, async (err, data) =>{
            await interaction.reply({ embeds: [sucess], ephemeral: true});
        })

    }
}