const { SlashCommandBuilder } = require('@discordjs/builders');
const { Permissions, ChannelType, PermissionFlagsBits, PermissionOverwriteManager, PermissionsBitField, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('slot')
        .setDescription('Create a new slot with a user and category.')
        .addUserOption(option =>
            option.setName('member')
                .setDescription('The member to slot the channel for.')
                .setRequired(true))
        .addChannelOption(option =>
            option.setName('category')
                .setDescription('The category to create the channel in.')
                .setRequired(true)
                .addChannelTypes(ChannelType.GuildCategory))
        .addIntegerOption((option) => option
            .setName(`days`)
            .setDescription(`Time of the slot period.`)
            .setRequired(true))
            .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    async execute(interaction) {
        const member = interaction.options.getUser('member');
        const category = interaction.options.getChannel('category');
        const duration = interaction.options.getInteger(`days`);
        const days = duration * 24 * 60 * 60 * 1000
        const futureDate = new Date(Date.now() + days);
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        const locale = 'en-US';
        const humanDate = futureDate.toLocaleDateString(locale, options);

        const newChannel = await interaction.guild.channels.create({
            name: `${member.username}`,
            type: ChannelType.GuildText,
            parent: category,
            permissionOverwrites: [
                {
                    id: interaction.guild.roles.everyone,
                    deny: PermissionsBitField.Flags.SendMessages,
                },
                {
                    id: member.id,
                    allow: PermissionsBitField.Flags.SendMessages | PermissionsBitField.Flags.MentionEveryone,
                },
            ],
        });

        const slotEmbed = new EmbedBuilder()
            .setColor(`Blurple`)
            .setTitle(`Slot Rules`)
            .setDescription(`• Max 3 here pings.\n• No everyone pings.\n• Slots are only for buying and selling\n• Any kind of promotion is not allowed.\n• No refund on private slots.\n• You can't share your slot.\n• You can't resell your slot.\n• If you had permanent slot before and you are inactive for more than 1 month, we have the right to revoke your slot with a refund.\n• If you are abusing owners, servers or any nations; you will be permanently banned with no refund.\n• Scamming is not tolerated and will result in a permanent ban.\n\nNot following the rules can lead to your slot being removed without a refund.`)

        const timer = new EmbedBuilder()
            .setColor(`Yellow`)
            .setTitle(`Slot Information`)
            .setDescription(`**Owner:** ${member}\n**Ends on** ${humanDate}`)

        await newChannel.send({ embeds: [slotEmbed, timer] })

        await interaction.reply({ content: `New slot channel ${newChannel} created for ${member} in ${category} for ${duration} days.`, ephemeral: true });
    },
};
