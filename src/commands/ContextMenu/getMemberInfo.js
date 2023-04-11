const {
    ContextMenuInteraction,
    EmbedBuilder,
    ContextMenuCommandBuilder,
    ApplicationCommandType,
} = require("discord.js");

module.exports = {
    data: new ContextMenuCommandBuilder()
        .setName("Find Member Info")
        .setType(ApplicationCommandType.User)
        .setDMPermission(false),
    /**
     * 
     * @param {ContextMenuInteraction} interaction 
     */
    async execute(interaction) {
        const target = await interaction.guild.members.fetch(interaction.targetId);
        const user = await interaction.guild.members.fetch(target.id);

        const response = new EmbedBuilder()
            .setColor("Blue")
            .setAuthor({ name: target.user.tag, iconURL: target.user.displayAvatarURL() })
            .setThumbnail(target.user.displayAvatarURL())
            .addFields(
                { name: "Member", value: `${target}`, inline: true },
                { name: "Nickname", value: target.nickname || "None", inline: true },
                { name: "Bot Account", value: `${user.bot ? "True" : "False"}` },
                { name: "Roles", value: `${target.roles.cache.map(r => r).join(' ')}`, inline: false },
                { name: "Joined Server", value: `<t:${parseInt(target.joinedAt / 1000)}:R>`, inline: true },
                { name: "Joined Discord", value: `<t:${parseInt(target.user.createdAt / 1000)}:R>`, inline: true },
            )
            .setFooter({ text: `ID: ${target.user.id}` })
        await interaction.reply({ embeds: [response] }).catch(err => {
            console.log(err)
        });
    }
}