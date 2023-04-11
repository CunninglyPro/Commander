const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionFlagsBits,
} = require("discord.js");
const { default: axios } = require("axios");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("steal")
    .setDescription("Steal emojis and stickers from other servers.")
    .addSubcommand(subcommand =>
      subcommand
        .setName(`emoji`)
        .setDescription(`Steal an emoji from another server.`)
        .addStringOption(option =>
          option
            .setName(`emoji`)
            .setDescription(`The emoji to steal.`)
            .setRequired(true)
        )
        .addStringOption(option =>
        option
          .setName(`name`)
          .setDescription(`The name of the emoji.`)
          .setRequired(true)
      )
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName(`sticker`)
        .setDescription(`Steal a sticker from another server.`)
        .addStringOption(option =>
          option
            .setName(`sticker`)
            .setDescription(`The sticker to steal.`)
            .setRequired(true)
        )
        .addStringOption((option) =>
        option
          .setName(`name`)
          .setDescription(`The name of the emoji.`)
          .setRequired(true)
      )
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageEmojisAndStickers),
  async execute(interaction) {
    const subcommand = interaction.options.getSubcommand();
    let emojiToSteal = interaction.options.getString(`emoji`)?.trim();
    let name = interaction.options.getString(`name`);

    if (subcommand === `emoji`) {

      if (emojiToSteal.startsWith("<") && emojiToSteal.endsWith(">")) {
        const id = emojiToSteal.match(/\d{15,}/g)[0];
        const type = axios
          .get(`https://cdn.discordapp.com/emojis/${id}.gif`)
          .then((image) => {
            if (image) return "gif";
            else return "png";
          })
          .catch((err) => {
            return "png";
          });

        const emoji = `https://cdn.discordapp.com/emojis/${id}.${type}?quality=lossless`;

        if (!emoji.startsWith("http" || "https")) {
          return interaction.reply({
            content: `You can only steal emojis from other servers.`,
            ephemeral: true,
          });
        }

        await interaction.guild.emojis
          .create({ attachment: `${emoji}`, name: `${name}` })
          .then((createdEmoji) => {
            const embed = new EmbedBuilder()
              .setColor("Green")
              .setDescription(
                `Successfully stole emoji ${createdEmoji} with name **${name}**!`
              );

            return interaction.reply({ embeds: [embed] });
          })
          .catch((err) => {
            console.log(err)
            return interaction.reply({
              content: `Unable to steal the emoji.`,
              ephemeral: true,
            });
          });
      }
    }
  },
};
