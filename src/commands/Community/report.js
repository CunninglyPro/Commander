const { SlashCommandBuilder, EmbedBuilder, Embed } = require('discord.js');
const { QuickDB } = require('quick.db');
const db = new QuickDB();

// Create a Map to store the last time a user used the command
const cooldowns = new Map();

module.exports = {
    data: new SlashCommandBuilder()
    .setName('report')
    .setDescription('Report a member in this server.')
    .addUserOption((option) => 
    option.setName('member')
    .setDescription('The member to report.')
    .setRequired(true)
    )
    .addStringOption((option) => 
    option.setName('reason')
    .setDescription('Reason for your report.')
    .setRequired(true)
    ),

    async execute(interaction) {

        const notConfigured = new EmbedBuilder()
        .setTitle(`<:cross:1082334173915775046> ${interaction.guild.name} has the report command disabled.`)
        .setDescription(`Ask an administrator to enable report command using \`/reportchannel\`.`)

        let reportChannelID = await db.get(`reportch_${interaction.guild.id}`)
        if (!reportChannelID) return interaction.reply({embeds: [notConfigured], ephemeral: true})
        let reportChannel = interaction.guild.channels.cache.get(reportChannelID)
    

        const reporter = interaction.user
        const reporterID = reporter.id
        const target = interaction.options.getUser(`member`)
        const targetID = target.id
        const reason = interaction.options.getString(`reason`)
        const channel = interaction.client.channels.cache.get('1079284518139203635');

        // Check if the user is on cooldown
        if (cooldowns.has(reporterID)) {
            const lastTime = cooldowns.get(reporterID);
            const cooldownTime = 60 * 60 * 1000; // 1 hour in milliseconds
            const timeLeft = (lastTime + cooldownTime) - Date.now();

            const cooldownEmbed = new EmbedBuilder()
            .setTitle(`Please wait ${timeLeft}ms before reporting a member again.`)

            if (timeLeft > 0) {
                return interaction.reply({embeds: [cooldownEmbed], ephemeral: true});
            }
        }

        // Set the user on cooldown
        cooldowns.set(reporterID, Date.now());

        const embed = new EmbedBuilder()
        .setColor('Purple')
        .setTitle(`Report for ${target.tag}`)
        .addFields({name: `Reason`, value: reason})
        .setDescription(`${target}'s ID: ${targetID}\nReport by ${reporter.tag} • ID: ${reporterID}`)

        const embed2 = new EmbedBuilder()
        .setColor('Purple')
        .setTitle(`Your report for ${target.tag} has sent.`)
        .setDescription(`Reaosn: ${reason}`)

        await reportChannel.send({
            embeds: [embed]
        });
        interaction.reply({
            embeds: [embed2],
            ephemeral: true
        })
    },
};
