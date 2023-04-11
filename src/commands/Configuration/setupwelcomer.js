const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, PermissionsBitField, PermissionFlagsBits } = require('discord.js');
const { QuickDB } = require(`quick.db`);
const db = new QuickDB();

module.exports = {

    data: new SlashCommandBuilder()
    .setName('setupwelcomer')
    .setDescription('Setup or change welcome channel to greet members.')
    .addChannelOption(option => option.setName(`channel`).setDescription(`The channel to send welcome messages to.`).setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    async execute (interaction, client) {

        const noPerms = new EmbedBuilder()
        .setAuthor({name: `Error!`, iconURL: `https://cdn0.iconfinder.com/data/icons/shift-interfaces/32/Error-512.png`})
        .setDescription(`You are not allowed to use welcomer command.`)
        .setColor('DarkRed')

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) return await interaction.reply({ embeds: [noPerms], ephemeral: true });

        let channel = interaction.options.getChannel(`channel`);

        const sucess = new EmbedBuilder()
        .setAuthor({name: `Welcome messages will now be sent to #${channel.name}.`, iconURL: `https://upload.wikimedia.org/wikipedia/commons/thumb/c/c6/Sign-check-icon.png/800px-Sign-check-icon.png`})
        .setColor('Green')

        db.set(`welchannel_${interaction.guild.id}`, channel.id);

        await interaction.reply({ embeds: [sucess], ephemeral: true});

    }
}