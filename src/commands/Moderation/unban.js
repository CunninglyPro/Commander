const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, PermissionsBitField, ChannelType, PermissionFlagsBits } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
    .setName('unban')
    .setDescription(`Unban a member from server.`)
    .addUserOption(option => option.setName(`user`).setDescription(`The member to unban.`).setRequired(true))
    .addStringOption(option => option.setName(`reason`).setDescription(`The reason of unbanning the member.`))
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),

    async execute(interaction, client) {

        const userID = interaction.options.getUser(`user`);

        let reason = interaction.options.getString(`reason`);
        if (!reason) reason = `Unknown Reason`;

        const noPerms = new EmbedBuilder()
        .setAuthor({name: `Error!`, iconURL: `https://cdn0.iconfinder.com/data/icons/shift-interfaces/32/Error-512.png`})
        .setDescription(`You are not allowed to use unban command.`)
        .setColor('DarkRed')

        const selfBan = new EmbedBuilder()
        .setAuthor({name: `Error!`, iconURL: `https://cdn0.iconfinder.com/data/icons/shift-interfaces/32/Error-512.png`})
        .setDescription(`You can't use the unban command on yourself.`)
        .setColor('DarkRed')        

        if(!interaction.member.permissions.has(PermissionsBitField.Flags.BanMembers)) return await interaction.reply({ embeds: [noPerms], ephemeral: true });
        if(interaction.member.id === userID) return await interaction.reply({ embeds: [selfBan], ephemeral: true });

        const dmMsg = new EmbedBuilder()
        .setAuthor({name: `You have been unbanned from ${interaction.guild.name} for ${reason}`, iconURL: `https://cdn3.emoji.gg/emojis/3968-discord-banhammer.png`})
        .setColor('Red')

        const sucess = new EmbedBuilder()
        .setAuthor({name: `Sucessfully Unbanned`, iconURL: `https://upload.wikimedia.org/wikipedia/commons/thumb/c/c6/Sign-check-icon.png/800px-Sign-check-icon.png`})
        .setDescription(`${userID} for ${reason}.`)
        .setColor('Green')

        const fail = new EmbedBuilder()
        .setAuthor({name: `Error!`, iconURL: `https://cdn0.iconfinder.com/data/icons/shift-interfaces/32/Error-512.png`})
        .setDescription(`Unable to unban this user.`)
        .setColor('DarkRed')

        await interaction.guild.bans.fetch()
        .then(async bans => {

            await interaction.guild.bans.remove(userID, reason).catch(err => {
                return;
            })
        })
        
        await interaction.reply({ embeds: [sucess], ephemeral: true }).catch(err => {
            return interaction.reply({ embeds: [fail]})
        })
    }

}