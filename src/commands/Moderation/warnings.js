const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, PermissionsBitField, PermissionFlagsBits } = require('discord.js');
const warnSchema = require(`../../Schemas.js/warnSchema`)

module.exports = {

    data: new SlashCommandBuilder()
    .setName('warnings')
    .setDescription('List the amount of warnings recived by a member.')
    .addUserOption(option => option.setName(`member`).setDescription('The member to list warns.')),

async execute(interaction, client) {
  const member = interaction.options.getUser(`member`) || interaction.user;
  const memberTag = member.tag || member.user.tag;
  
  const res1 = await warnSchema.find({
    GuildID: interaction.guild.id,
    UserID: member.id,
    Reason: { $exists: true }
  });

  if (!res1 || res1.length === 0) {
    const noWarnsEmbed = new EmbedBuilder()
      .setTitle(`<:cross:1082334173915775046> ${memberTag} hasn't received any warnings yet!`)
      .setColor('Red');
    return await interaction.reply({
      embeds: [noWarnsEmbed],
      ephemeral: true
    });
  }

  const warns = res1.map((warn) => ({
    name: `Reason: ${warn.Reason.join(', ')}`,
    value: `Date: ${warn.Date}`
  }));

  const showWarnsEmbed = new EmbedBuilder()
    .setTitle(`<:check:1082334169197187153> ${member.username}'s warnings in ${interaction.guild.name}`)
    .addFields(warns)
    .setColor('Green');

  await interaction.reply({ embeds: [showWarnsEmbed] });
}
}