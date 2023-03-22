const { SlashCommandBuilder, EmbedBuilder, AttachmentBuilder, PermissionFlagsBits } = require('discord.js');
const level = require('../../Schemas.js/level');
const levelSchema = require("../../Schemas.js/level")

 
module.exports = {
    data: new SlashCommandBuilder()
        .setName('leaderboard')
        .setDescription('List the top 10 members based on their XP.'),

    async execute (interaction) {

        const { guild, client } = interaction;

        let text = "";

        const noLead = new EmbedBuilder()
        .setColor(`DarkRed`)
        .setAuthor({name: `No one has reached the leaderboard yet.`, iconURL: `https://cdn0.iconfinder.com/data/icons/shift-interfaces/32/Error-512.png`})

        const Data = await levelSchema.find({Guild: guild.id})
        .sort({
            XP: -1,
            Level: -1
        })
        .limit(10)

        if(!Data) return await interaction.reply({embeds: [noLead], ephemeral: true})

        await interaction.deferReply();

        for (let counter = 0; counter < Data.length; ++counter) {
            let {User, XP, Level} = Data[counter];

            const value = await client.users.fetch(User) || "Unknown Member";

            const member = value.tag;

            text += `#${counter + 1}. ${member} • Level: ${Level} • XP: ${XP}\n`

            const lbEmbed = new EmbedBuilder()
            .setColor('Yellow')
            .setTitle(`🏆 ${interaction.guild.name}'s Leaderboard`)
            .setDescription(`\`\`\`${text}\`\`\``)

            interaction.editReply({embeds: [lbEmbed]}); 

        }
        

}}