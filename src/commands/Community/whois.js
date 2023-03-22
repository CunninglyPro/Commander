const {
    ContextMenuInteraction,
    EmbedBuilder,
    SlashCommandBuilder
} = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("whois")
        .setDescription(`Find information about a member.`)
        .addUserOption((option) => option
        .setName(`member`)
        .setDescription(`The member you want to find the information of.`)
        .setRequired(true))
        .setDMPermission(false),

    async execute(interaction) {

        const member = interaction.options.getUser(`member`)

        const response = new EmbedBuilder()
            .setColor("0x2f3136")
            .setAuthor({ name: member.tag, iconURL: member.displayAvatarURL() })
            .setThumbnail(member.displayAvatarURL())
            .addFields(
                { name: "Member", value: `${member}`, inline: true },
                { name: "Nickname", value: member.nickname || "None", inline: true },
                { name: "Bot Account", value: `${member.bot ? "True" : "False"}` },
                { name: "Roles", value: `${member.roles?.cache.map(r => r).join(' ') || "None"}`, inline: false },
                { name: "Joined Server", value: `${member.joinedAt ? `<t:${parseInt(member.joinedAt / 1000)}:R>` : "Unknown"}`, inline: true },
                { name: "Joined Discord", value: `<t:${parseInt(member.createdAt / 1000)}:R>`, inline: true },
            )
            .setFooter({ text: `Member ID: ${member.id}` })
        await interaction.reply({ embeds: [response]}).catch(err => {
            console.log(err)
        });
    }
}
