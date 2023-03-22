const { SlashCommandBuilder, PermissionFlagsBits, ChannelType, EmbedBuilder } = require(`discord.js`);
 
module.exports = {
    data: new SlashCommandBuilder()
        .setName('slowmode')
        .setDescription('Change the slowmode of a channel')
        .addSubcommand(subcommand => subcommand
            .setName('set')
            .setDescription('Set the slowmode of a channel')
            .addChannelOption(option => option
                .setName('channel')
                .setDescription('The channel to set the slowmode of')
                .addChannelTypes(ChannelType.GuildText)
                .setRequired(true)
            )
            .addIntegerOption(option => option
                .setName('time')
                .setDescription('The time in seconds to set the slowmode of the channel to')
                .setRequired(true)
                .setMinValue(1)
            )
            .addStringOption(option => option
                .setName('timeformat')
                .setDescription('The time format to set the slowmode of the channel to')
                .addChoices(
                    { name: 'Seconds', value: 'seconds' },
                    { name: 'Minutes', value:'minutes' },
                    { name: 'Hours', value: 'hours' },
                )
                .setRequired(true)
            )
        )
        .addSubcommand(subcommand => subcommand
            .setName('disable')
            .setDescription('Disable the slowmode of a channel')
            .addChannelOption(option => option
                .setName('channel')
                .setDescription('The channel to disable the slowmode of')
                .addChannelTypes(ChannelType.GuildText)
                .setRequired(true)
            )
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
        .setDMPermission(false),
 
    async execute(interaction) {
 
        // Get the Command Options
        const channel = interaction.options.getChannel('channel');
        const time = interaction.options.getInteger('time');
        const timeformat = interaction.options.getString('timeformat');
 
        // transfer the time to the correct format
        let timeInSeconds = 0;
        switch (timeformat) {
            case'seconds':
                timeInSeconds = time;
                break;
            case'minutes':
                timeInSeconds = time * 60;
                break;
            case 'hours':
                timeInSeconds = time * 60 * 60;
                break;
        }

        const error1 = new EmbedBuilder()
        .setAuthor({name: `You cannot set slowmode length over 6 hours.`, iconURL: `https://cdn0.iconfinder.com/data/icons/shift-interfaces/32/Error-512.png`})
        .setColor('Red')
        if (timeInSeconds > 21600) return interaction.reply({embeds: [error1], ephemeral: true})

        // Defining Embeds

        const setSucess = new EmbedBuilder()
        .setAuthor({name: `Slowmode of #${channel.name} has been set to ${time} ${timeformat}`, iconURL: `https://upload.wikimedia.org/wikipedia/commons/thumb/c/c6/Sign-check-icon.png/800px-Sign-check-icon.png`})
        .setColor('Green')

        const disSucess = new EmbedBuilder()
        .setAuthor({name: `Slowmode of #${channel.name} has been disabled.`, iconURL: `https://upload.wikimedia.org/wikipedia/commons/thumb/c/c6/Sign-check-icon.png/800px-Sign-check-icon.png`})
        .setColor('Green')
 
        // Switch for the subcommands
        switch (interaction.options.getSubcommand()) {
            case'set':
                await channel.setRateLimitPerUser(timeInSeconds);
                interaction.reply({ embeds: [setSucess], ephemeral: true });
                break;
            case 'disable':
                await channel.setRateLimitPerUser(0);
                interaction.reply({ embeds: [disSucess], ephemeral: true });
                break;
        }
 
    },
}