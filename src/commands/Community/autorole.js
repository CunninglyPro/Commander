const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, PermissionsBitField, PermissionFlagsBits } = require('discord.js');
const { QuickDB } = require(`quick.db`);
const db = new QuickDB();

module.exports = {

    data: new SlashCommandBuilder()
    .setName('autorole')
    .setDescription('Give roles to members automatically when they join the server.')
    .addRoleOption((option) => option
    .setName(`role`)
    .setDescription(`The role to assign to new members.`)
    .setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    async execute (interaction, client) {

        const noPerms = new EmbedBuilder()
        .setAuthor({name: `Error!`, iconURL: `https://cdn0.iconfinder.com/data/icons/shift-interfaces/32/Error-512.png`})
        .setDescription(`You are not allowed to use this command.`)
        .setColor('DarkRed')

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) return await interaction.reply({ embeds: [noPerms], ephemeral: true });

        let role = interaction.options.getRole(`role`);

        const sucess = new EmbedBuilder()
        .setTitle(`New members will be assigned with the role ${role.name}`)
        .setColor('Green')

        db.set(`autoRole_${interaction.guild.id}`, role.id);

        await interaction.reply({ embeds: [sucess], ephemeral: true});

    }
}