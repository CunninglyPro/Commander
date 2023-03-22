const { EmbedBuilder, SlashCommandBuilder, Collection } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('snipe')
        .setDescription(`Recover last deleted message.`),
    async execute(interaction, client) {

        const notFound = new EmbedBuilder()
            .setColor(`Red`)
            .setDescription(`<:cross:1082334173915775046> Unable to find any recently deleted or edited messages!`)
            const snipes = client.snipes.get(interaction.channel.id)
            const editSnipes = client.editsnipes.get(interaction.channel.id)
            

        if (!snipes && !editSnipes){
            return await interaction.reply({ embeds: [notFound], ephemeral: true })}

        let embeds = [];

        if (snipes) {
            let content = snipes?.message ? `\`${snipes?.message}\`` : '`No content`';
            const embed = new EmbedBuilder()
                .setTitle(`Snipe in ${interaction.channel.name}`)
                .setColor('Yellow')
                .setDescription(`*Content:*\n${content}`)
                .setAuthor({
                    name: `${snipes.author?.tag}`,
                    iconURL: snipes.author?.displayAvatarURL() ?? null,
                })
                .setImage(snipes.attachment ?? null)
                .addFields({name: 'Time', value: `<t:${snipes.time}:R>`});

            embeds.push(embed);
        }
        if (editSnipes) {
            let description = `**Current Content:**\n ${editSnipes.currs}\n\n **Previous Content:**\n ${editSnipes.prevs}`;
            const embed = new EmbedBuilder()
                .setTitle(`Edit Snipe in ${interaction.channel.name}`)
                .setColor('Yellow')
                .setDescription(description)
                .setAuthor({
                    name: `${editSnipes.author?.tag}`,
                    iconURL: editSnipes.author?.displayAvatarURL() ?? null,
                })
                .addFields({name: 'Time', value: `<t:${editSnipes.time}:R>`});

            embeds.push(embed);
        }

        await interaction.reply(embeds).catch()
    }

}