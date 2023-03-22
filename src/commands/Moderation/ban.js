const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, PermissionsBitField, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('ban')
    .setDescription('Ban a member from the server.')
    .addUserOption(option => option.setName('user').setDescription('The user to ban.').setRequired(true))
    .addStringOption(option => option.setName('reason').setDescription('The reason for banning the user.'))
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),
    async execute (interaction, client) {

        const banUser = interaction.options.getUser('user');
        const banMember = await interaction.guild.members.fetch(banUser.id);
        const channel = interaction.channel;

        let reason = interaction.options.getString('reason');
        if (!reason) reason = "unknown reason";

        // Defining Embeds

        const noPerms = new EmbedBuilder()
        .setAuthor({name: `Error!`, iconURL: `https://cdn0.iconfinder.com/data/icons/shift-interfaces/32/Error-512.png`})
        .setDescription(`You are not allowed to use ban command.`)
        .setColor('DarkRed')

        const selfBan = new EmbedBuilder()
        .setAuthor({name: `Error!`, iconURL: `https://cdn0.iconfinder.com/data/icons/shift-interfaces/32/Error-512.png`})
        .setDescription(`You can't use the ban command on yourself.`)
        .setColor('DarkRed')  

        const dmEmbed = new EmbedBuilder()
        .setAuthor({name: `You have been banned from ${interaction.guild.name} for ${reason}`, iconURL: `https://cdn3.emoji.gg/emojis/3968-discord-banhammer.png`})
        .setColor('Red')

        const sucess = new EmbedBuilder()
        .setAuthor({name: `${banUser.tag} has been banned for ${reason}.`, iconURL: `https://upload.wikimedia.org/wikipedia/commons/thumb/c/c6/Sign-check-icon.png/800px-Sign-check-icon.png`})
        .setColor('Green')

        const fail = new EmbedBuilder()
        .setAuthor({name: `Error!`, iconURL: `https://cdn0.iconfinder.com/data/icons/shift-interfaces/32/Error-512.png`})
        .setDescription(`Unable to ban this user.`)
        .setColor('DarkRed')

        const notPresent = new EmbedBuilder()
        .setAuthor({name: `Error!`, iconURL: `https://cdn0.iconfinder.com/data/icons/shift-interfaces/32/Error-512.png`})
        .setDescription(`The user mentioned is no longer within the server.`)
        .setColor('DarkRed')

        const roleIssue = new EmbedBuilder()
        .setAuthor({name: `Error!`, iconURL: `https://cdn0.iconfinder.com/data/icons/shift-interfaces/32/Error-512.png`})
        .setDescription(`The role of the mentioned user is higher than either me or you.`)
        .setColor('DarkRed')

        // Execution Code

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.BanMembers)) return await interaction.reply({ embeds: [noPerms], ephemeral: true });
        if (!banMember) return await interaction.reply({ embeds: [notPresent], ephemeral: true});
        if (!banMember.kickable) return await interaction.reply({ embeds: [roleIssue], ephemeral: true});

        await banMember.send({ embeds: [dmEmbed] }).catch(err => {
            return;
        });

        await banMember.ban({ reason: reason }).catch(err => {
            return;
        });

        await interaction.reply({ embeds: [sucess], ephemeral: true }).catch(err => {
            return;
        });
        

    }
}