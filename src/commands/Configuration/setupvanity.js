const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionFlagsBits,
} = require(`discord.js`);
const vanitySchema = require(`../../schemas/vanitySchema`);

module.exports = {
  data: new SlashCommandBuilder()
    .setName("setupvanity")
    .setDescription("Setup status vanity link for your server.")
    .addStringOption((option) => 
      option
        .setName(`text`)
        .setDescription(`What you want the members to put in their status.`)
        .setRequired(true)
    )
    .addRoleOption((option) =>
      option
        .setName(`role`)
        .setDescription(
          `The role you want to give to the member who adds the vanity link.`
        )
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  async execute(interaction) {
    const text = interaction.options.getString(`text`)
    const role = interaction.options.getRole(`role`)

    const alreadyExists = await vanitySchema.findOne({
      GuildID: interaction.guild.id,
      Text: text.toLowerCase(),
    });

    if (alreadyExists) {
      return interaction.reply({
        content: "You already have set-up your vanity link!",
        ephemeral: true,
      });
    }

    const roleID = role.id

    const newVanity = new vanitySchema({
        GuildID: interaction.guild.id,
        Role: roleID,
        Text: text.toLowerCase(),
    }) 

    const embed = new EmbedBuilder()
    .setColor(`Green`)
    .setDescription(`Sucessfully set/changed the vanity url to ${text} and role to ${role}`)

    await newVanity.save()
    await interaction.reply({embeds: [embed], ephemeral: true})

  },
};
