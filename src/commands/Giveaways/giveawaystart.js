const { SlashCommandBuilder } = require(`@discordjs/builders`);
const ms = require('ms');
const { mongoose } = require(`mongoose`);
const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName(`giveaway`)
        .setDescription(`Manage your giveaways with start, edit, end or reroll.`)
        .addSubcommand(subcommand => subcommand
            .setName(`start`)
            .setDescription(`Start a giveaway.`)
            .addStringOption(option =>
                option
                    .setName('duration')
                    .setDescription('The duration of the giveaway In milliseconds')
                    .setRequired(true))
            .addIntegerOption(option =>
                option
                    .setName('winners')
                    .setDescription('The Amount Of Winners')
                    .setRequired(true))
            .addStringOption(option =>
                option
                    .setName('prize')
                    .setDescription('The prize For The Giveaway')
                    .setRequired(true))
            .addChannelOption(option =>
                option
                    .setName('channel')
                    .setDescription('The channel for  The Giveaway'))
            .addStringOption(option =>
                option
                    .setName('content')
                    .setDescription('The Content Of The Giveaway')))
            .setDefaultMemberPermissions(PermissionFlagsBits.ManageEvents),



    async execute(interaction, client) {

        const subcommand = interaction.options.getSubcommand();

        if (!mongoose.connect) await interaction.reply(`no Mongodb Url Provided`)

        await interaction.reply({ embeds: [new EmbedBuilder().setDescription(`Starting the giveaway...`)], ephemeral: true })

        const { GiveawaysManager } = require("discord-giveaways");


        const duration = ms(interaction.options.getString("duration") || "")
        const winnerCount = interaction.options.getInteger('winners');
        const prize = interaction.options.getString('prize');
        const contentmain = interaction.options.getString(`content`);
        const channel = interaction.options.getChannel("channel")
        if (!channel && !contentmain)
            client.giveawayManager.start(interaction.channel, {
                prize,
                winnerCount,
                duration,
                hostedBy: interaction.user,
                lastChance: {
                    enabled: false,
                    content: contentmain,
                    threshold: 60000000000_000,
                    embedColor: '#FF0000'
                }
            });

        else if (!channel)
            client.giveawayManager.start(interaction.channel, {
                prize,
                winnerCount,
                duration,
                hostedBy: interaction.user,
                lastChance: {
                    enabled: true,
                    content: contentmain,
                    threshold: 60000000000_000,
                    embedColor: '#FF0000'
                }
            });
        else if (!contentmain)
            client.giveawayManager.start(channel, {
                prize,
                winnerCount,
                duration,
                hostedBy: interaction.user,
                lastChance: {
                    enabled: false,
                    content: contentmain,
                    threshold: 60000000000_000,
                    embedColor: '#FF0000'
                }
            });
        else
            client.giveawayManager.start(channel, {
                prize,
                winnerCount,
                duration,
                hostedBy: interaction.user,
                lastChance: {
                    enabled: true,
                    content: contentmain,
                    threshold: 60000000000_000,
                    embedColor: '#FF0000'
                }
            });

        interaction.editReply({ content: `Giveaway Started`, ephemeral: true })
    }

}