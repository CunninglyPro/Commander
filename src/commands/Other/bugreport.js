const { SlashCommandBuilder, EmbedBuilder, Embed } = require('discord.js');

// Create a Map to store the last time a user used the command
const cooldowns = new Map();

module.exports = {
    data: new SlashCommandBuilder()
    .setName('bugreport')
    .setDescription('Report a bug regarding the bot.')
    .addStringOption((option) => 
    option.setName('bug')
    .setDescription('Describe the bug.')
    .setRequired(true)
    ),

    async execute(interaction) {

        const user = interaction.user
        const userID = user.id
        let bug = interaction.options.getString('bug');
        const channel = interaction.client.channels.cache.get('1079284518139203635');

        // Check if the user is on cooldown
        if (cooldowns.has(userID)) {
            const lastTime = cooldowns.get(userID);
            const cooldownTime = 60 * 60 * 1000; // 1 hour in milliseconds
            const timeLeft = (lastTime + cooldownTime) - Date.now();

            const cooldownEmbed = new EmbedBuilder()
            .setTitle(`Please wait ${timeLeft}ms before reporting a bug again.`)

            if (timeLeft > 0) {
                return interaction.reply({embeds: [cooldownEmbed], ephemeral: true});
            }
        }

        // Set the user on cooldown
        cooldowns.set(userID, Date.now());

        const embed = new EmbedBuilder()
        .setColor('Purple')
        .setAuthor({name: `Bug Report by ${user.tag}`, iconURL: user.displayAvatarURL()})
        .setDescription(`${bug}`)
        const embed2 = new EmbedBuilder()
        .setColor('Purple')
        .setAuthor({name: `You have successfully sent a bug report.`})
        .setDescription(`Bug: ${bug}`)

        await channel.send({
            embeds: [embed]
        });
        interaction.reply({
            embeds: [embed2],
            ephemeral: true
        })
    },
};
