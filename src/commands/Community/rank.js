const { SlashCommandBuilder, EmbedBuilder, AttachmentBuilder } = require('discord.js');
const levelSchema = require("../../Schemas.js/level")
const canvacord = require("canvacord")

 
module.exports = {
    data: new SlashCommandBuilder()
        .setName('rank')
        .setDescription('Find your or someone else\'s rank in the server.')
        .addUserOption(option => option.setName(`user`).setDescription(`The member you want to check the rank of.`).setRequired(false)),
    async execute(interaction) {

        const { options, user, guild } = interaction;

        const Member = options.getUser(`user`) || user;
        const member = guild.members.cache.get(Member.id);
        const Data = await levelSchema.findOne({Guild: guild.id, User: member.id});

        const noLevel = new EmbedBuilder()
        .setColor("Red")
        .setDescription(`:negative_squared_cross_mark: ${member} you are currently *unranked*.`)

        if (!Data) return await interaction.reply({embeds: [noLevel], ephemeral: true})

        await interaction.deferReply();

        const required = Data.Level * Data.Level * 20 + 20

        const rank = new canvacord.Rank()
        .setAvatar(member.displayAvatarURL({forseStatic: true}))
        .setBackground("IMAGE", `https://img.freepik.com/free-vector/hand-painted-watercolor-pastel-sky-background_23-2148902771.jpg`)
        .setCurrentXP(Data.XP)
        .setRequiredXP(required)
        .setRank(1, "Rank", false)
        .setLevel(Data.Level, "Level")
        .setUsername(member.user.username)
        .setDiscriminator(member.user.discriminator)

        const card = await rank.build();
        const attachment = new AttachmentBuilder(card, {name: "rank.png"});

        const embed2 = new EmbedBuilder()
        .setColor("Aqua")
        .setTitle(`${member.user.username}'s level.`)
        .setImage("attachment://rank.png")

        await interaction.editReply({embeds: [embed2], files: [attachment]})

    }
}