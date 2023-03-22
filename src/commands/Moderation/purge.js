const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, PermissionsBitField, ButtonBuilder, ActionRowBuilder, ButtonStyle, Embed, PermissionFlagsBits } = require('discord.js')
const wait = require('node:timers/promises').setTimeout;

module.exports = {
    data: new SlashCommandBuilder()
    .setName('purge')
    .setDescription(`Delete multiple messages at once.`)
    .addIntegerOption(option => option.setName(`amount`).setDescription(`Amount of messages to delete.`).setMinValue(1).setMaxValue(100).setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),

    async execute(interaction, client) {

        const noPerms = new EmbedBuilder()
        .setAuthor({name: `Error!`, iconURL: `https://cdn0.iconfinder.com/data/icons/shift-interfaces/32/Error-512.png`})
        .setDescription(`You are not allowed to use purge command.`)
        .setColor('DarkRed')

        if(!interaction.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) return interaction.reply({ embeds: [noPerms], ephemeral: true })

        let number = interaction.options.getInteger(`amount`);

        const sucess = new EmbedBuilder()
        .setAuthor({name: `Deleted ${number} messages.`, iconURL: `https://upload.wikimedia.org/wikipedia/commons/thumb/c/c6/Sign-check-icon.png/800px-Sign-check-icon.png`})
        .setColor('Green')

        await interaction.channel.bulkDelete(number)
        
        const message = await interaction.reply({ embeds: [sucess], ephemeral: true })
    }

}