const { EmbedBuilder } = require("discord.js");
const cooldowns = new Map();
const cooldownDuration = process.env.Cooldown;
const errChannelID = process.env.ErrorChannelID;

module.exports = {
    name: 'interactionCreate',
    async execute(interaction, client) {
        if (!interaction.isCommand()) return;

        const command = client.commands.get(interaction.commandName);
        const errChannel = client.channels.cache.get(errChannelID); // Fetch the errChannel from the cache

        if (!command) return;

        const errNotify = new EmbedBuilder()
        .setColor(`Red`)
        .setTitle(`<:cross:1082334173915775046> An unexpected error has occurred.`);

        const errorEmbed = new EmbedBuilder()
        .setColor('Red')
        .setDescription(`<:cross:1082334173915775046> An unexpected error occured!\nPlease use \`/bugreport\` command to report this issue.`);

        const cooldownEmbed = new EmbedBuilder()
        .setColor('Red')
        .setDescription(`<:cross:1082334173915775046> Please wait ${cooldownDuration / 1000} seconds before using this command again.`);

        if (cooldowns.has(interaction.user.id)) return interaction.reply({
            embeds: [cooldownEmbed],
            ephemeral: true
        });

        try{
            await command.execute(interaction, client).then(() => {
                cooldowns.set(interaction.user.id, Date.now());
                setTimeout(() => {
                    cooldowns.delete(interaction.user.id);
                }, cooldownDuration);
            });
        } catch (error) {
            await interaction.reply({
                embeds: [errorEmbed],
                ephemeral: true
            });
            errChannel.send({ embeds: [errNotify.setDescription(`\`\`\`${error}\n\`\`\``)] });
        } 
    },
};
