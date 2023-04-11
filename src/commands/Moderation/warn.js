const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, PermissionsBitField, PermissionFlagsBits } = require('discord.js');
const { QuickDB } = require(`quick.db`);
const db = new QuickDB();
const warnSchema = require(`../../schemas/warnSchema`)

module.exports = {

    data: new SlashCommandBuilder()
    .setName('warn')
    .setDescription('Warn or remove a warning from a member..')
    .addSubcommand(subcommand => subcommand
        .setName(`add`)
        .setDescription(`Add a warning to a member.`)
        .addUserOption(option => option.setName(`member`).setDescription('The member to warn.').setRequired(true))
        .addStringOption(option => option.setName('reason').setDescription('The reason for warning the member.').setRequired(true))
        )
    .addSubcommand(subcommand => subcommand
        .setName(`clear`)
        .setDescription(`Clear all warnings from a member.`)
        .addUserOption(option => option.setName(`member`).setDescription('The member to clear the warns of.').setRequired(true)))
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),

    async execute (interaction, client) {

        const subcommand = interaction.options.getSubcommand();
        const member = interaction.options.getUser(`member`);

        const noPerms = new EmbedBuilder()
        .setAuthor({name: `Error!`, iconURL: `https://cdn0.iconfinder.com/data/icons/shift-interfaces/32/Error-512.png`})
        .setDescription(`You are not allowed to use warn command.`)
        .setColor('DarkRed')

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.KickMembers)) return await interaction.reply({ embeds: [noPerms], ephemeral: true });

        if (subcommand === `add`) {
        let reason = interaction.options.getString(`reason`);

        const dmEmbed = new EmbedBuilder()
        .setTitle(`<:alert:1082334164189184051> You have been warned in ${interaction.guild.name} for ${reason}`)
        .setColor('Red')

        const sucess = new EmbedBuilder()
        .setTitle(`<:check:1082334169197187153> ${member.tag} has been warned for ${reason}.`)
        .setColor('Green')

        const currentDate = new Date();
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        const locale = 'en-US';
        const humanDate = currentDate.toLocaleDateString(locale, options);

        const DataWarn = new warnSchema({
            GuildID: interaction.guild.id,
            UserID: member.id,
            Date: humanDate,
            Reason: [reason]
        });
        

        await interaction.reply({ embeds: [sucess], ephemeral: true })

        await member.send({ embeds: [dmEmbed] }).catch(err => {
            return interaction.editReply({embeds: [sucess.setDescription(`Unable to send a DM alert to the member.`)], ephemeral: true})
        })

        await DataWarn.save()
    }

    if (subcommand === `clear`) {

        const sucess = new EmbedBuilder()
        .setTitle(`<:check:1082334169197187153> Cleared warns from ${member.tag}`)
        .setColor('Green')

        const fail = new EmbedBuilder()
        .setTitle(`<:cross:1082334173915775046> Unable to clear warns from ${member.tag}`)

        await warnSchema.deleteMany({ GuildID: interaction.guild.id, UserID: member.id });
        await interaction.reply({ embeds: [sucess], ephemeral: true });

    }
}
}