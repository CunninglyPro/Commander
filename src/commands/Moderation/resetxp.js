const { SlashCommandBuilder, EmbedBuilder, AttachmentBuilder, PermissionFlagsBits } = require('discord.js');
const levelSchema = require("../../schemas/level");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('resetxp')
        .setDescription('Reset a member or everyone\'s XP and level.')
        .addUserOption(option => option.setName(`user`).setDescription(`Specify a specific user to reset XP of.`).setRequired(false))
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    async execute(interaction) {
        const { guildId } = interaction;
        const target = interaction.options.getUser(`user`);

        if (!target) {
            await levelSchema.deleteMany({ Guild: guildId });
            const success = new EmbedBuilder()
                .setAuthor({ name: `Everyone's XP has been reset in this server.`, iconURL: `https://upload.wikimedia.org/wikipedia/commons/thumb/c/c6/Sign-check-icon.png/800px-Sign-check-icon.png` })
                .setColor('Green');
            await interaction.reply({ embeds: [success], ephemeral: true });
        } else {
            await levelSchema.deleteMany({ Guild: guildId, User: target.id });
            const success = new EmbedBuilder()
                .setAuthor({ name: `${target.tag}'s XP has been reset.`, iconURL: `https://upload.wikimedia.org/wikipedia/commons/thumb/c/c6/Sign-check-icon.png/800px-Sign-check-icon.png` })
                .setColor('Green');
            await interaction.reply({ embeds: [success], ephemeral: true });
        }
    },
};
