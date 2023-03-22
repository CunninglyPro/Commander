const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, PermissionsBitField, ChannelType, PermissionFlagsBits } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
    .setName('lock')
    .setDescription(`Lock a channel.`)
    .addChannelOption(option => option.setName(`channel`).setDescription(`The channel to lock.`).addChannelTypes(ChannelType.GuildText).setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),

    async execute(interaction) {

        const noPerms = new EmbedBuilder()
        .setAuthor({name: `Error!`, iconURL: `https://cdn0.iconfinder.com/data/icons/shift-interfaces/32/Error-512.png`})
        .setDescription(`You are not allowed to use lock command.`)
        .setColor('DarkRed')

        if(!interaction.member.permissions.has(PermissionsBitField.Flags.ManageChannels)) return await interaction.reply({ embeds: [noPerms], ephemeral: true })

        let channel = interaction.options.getChannel(`channel`);

        channel.permissionOverwrites.create(interaction.guild.id, { SendMessages: false })

        const sucess = new EmbedBuilder()
        .setAuthor({name: `#${channel.name} has been locked.`, iconURL: `https://upload.wikimedia.org/wikipedia/commons/thumb/c/c6/Sign-check-icon.png/800px-Sign-check-icon.png`})
        .setColor('Green')
        
        await interaction.reply({ embeds: [sucess], ephemeral: true })
    }

}