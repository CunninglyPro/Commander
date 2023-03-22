const {SlashCommandBuilder, PermissionFlagsBits, ActionRowBuilder, ChannelType, SelectMenuBuilder, EmbedBuilder, PermissionsBitField}= require('discord.js')
 
const ticketSchema = require('../../Schemas.js/ticketSchema')
 
module.exports = {
    data: new SlashCommandBuilder()
    .setName('tickets')
    .setDescription('setup a ticket message')
    .addChannelOption(option => option.setName('channel').setDescription('the channel where you would like to send the ticket message').setRequired(true).addChannelTypes(ChannelType.GuildText))
    .addChannelOption(option => option.setName('category').setDescription('the category where all the tickets will be created').setRequired(true).addChannelTypes(ChannelType.GuildCategory))
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
 
    async execute(interaction) {
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) return await interaction.reply({content: 'you cannot create a ticket message as you do not have administrator perms!', ephemeral: true})
 
        const channel = interaction.options.getChannel('channel')
        const category = interaction.options.getChannel('category')
 
        ticketSchema.findOne({Guild: interaction.guild.id}, async(err, data) => {
            if(!data) {
                ticketSchema.create({
                    Guild: interaction.guild.id,
                    Channel: category.id,
                    Ticket: 'first',
                })
            } else {
                await interaction.reply({content: 'you already have a ticket message setup, you can remove it using /ticket-disable and try running the command again!', ephemeral: true})
                return;
            }
            const embed = new EmbedBuilder()
            .setTitle('Tickets and Support')
            .setDescription('If you have a problem/issue you can open a ticket and discuss with the staff members!')
            .setFooter({text: `${interaction.guild.name} tickets`})
 
            const menu = new ActionRowBuilder()
            .addComponents(
                new SelectMenuBuilder()
                .setCustomId('select')
                .setMaxValues(1)
                .setPlaceholder('Select a topic...')
                .addOptions(
 
 
                    {
                        label: 'General Support',
                        value: 'Subject: General Support',
                    },
                    {
                        label: 'Moderation Support',
 
                        value: 'Subject: Moderation Support'
                    },
                    {
                        label: 'Server Support',
 
                        value: 'Subject: Server Support'
                    },
                    {
                        label: 'Other',
 
                        value: 'Subject: Other',
                    },
                )
 
            )
            await channel.send({embeds: [embed], components: [menu]})
            await interaction.reply({content: `Your ticket system has been setup in ${channel}!`})
 
        })
 
 
    }
 
 
}