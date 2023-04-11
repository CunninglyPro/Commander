const {
    SlashCommandBuilder,
    PermissionsBitField,
    PermissionFlagsBits,
    EmbedBuilder
  } = require("discord.js");
  const CustomCommand = require("../../schemas/customcommand.js");
  
  module.exports = {
    data: new SlashCommandBuilder()
      .setName("setupcustoms")
      .setDescription(
        "Setup and manage custom commands for your server."
      )
      .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
      .addSubcommand(subcommand =>
        subcommand
          .setName(`add`)
          .setDescription(`Add a new custom command.`)
          .addStringOption(option =>
            option
              .setName("keyword")
              .setDescription("Keyword or sentence that triggers reply")
              .setRequired(true)
          )
          .addStringOption(option =>
            option
              .setName("reply")
              .setDescription("Gif or a text to reply with")
              .setRequired(true)
          )
      )
      .addSubcommand(subcommand =>
        subcommand
          .setName(`delete`)
          .setDescription(`Delete a custom command.`)
          .addStringOption(option =>
            option
              .setName(`keyword`)
              .setDescription(`Keyword of custom command to delete.`)
              .setRequired(true)
          )
      )
      .addSubcommand(subcommand =>
        subcommand
          .setName("list")
          .setDescription("List all custom commands in the guild")
      ),
    async execute (interaction) {
      if (
        !interaction.member.permissions.has(
          PermissionsBitField.Flags.Administrator
        )
      ) {
        await interaction.reply({
          content: "You dont have permissions to use this command",
          ephemeral: true,
        });
        return;
      }
      try {
        const subcommand = interaction.options.getSubcommand();
  
        // list

        if (subcommand === "list") {
            
            const res1 = await CustomCommand.find({ GuildID: interaction.guild.id });
            const commandList = res1.map((command) => {
              const name = command.Keyword || 'Unknown Keyword';
              const value = command.Reply || 'No reply specified!';
              return {
                  name,
                  value
                  }
            })
                          
            const embed = new EmbedBuilder()
              .setTitle(`Custom Commands in ${interaction.guild.name}`)
              .addFields(commandList)
              .setColor('Blurple');
          
            await interaction.reply({
              embeds: [embed]
            }).catch(err => {
                console.log(err)
            })

          }
          
          // delete

        if (subcommand === "delete") {
          const keywordToDelete = interaction.options.getString("keyword");
          const resDel = await CustomCommand.findOneAndDelete({
            GuildID: interaction.guild.id,
            Keyword: keywordToDelete,
          });
  
          if (resDel) {
            return interaction.reply({
              content: `Custom command with keyword "${keywordToDelete}" deleted successfully!`,
              ephemeral: true,
            });
          } else {
            return interaction.reply({
              content: `Custom command with keyword "${keywordToDelete}" not found`,
              ephemeral: true,
            });
          }
        }
        
        if (subcommand === "add") {
          let keyword = interaction.options.getString("keyword");
          let reply = interaction.options.getString("reply");
  
          // Check if the command already exists in the guild
          const alreadyExists = await CustomCommand.findOne({
            GuildID: interaction.guild.id,
            Keyword: keyword,
          });
  
          if (alreadyExists) {
            return interaction.reply({
              content: "This command already exists!",
              ephemeral: true,
            });
          }
  
          // Create the command
          const newCommand = new CustomCommand({
            GuildID: interaction.guild.id,
            Keyword: keyword,
            Reply: reply,
          });
  
          await newCommand.save();
  
          return interaction.reply({
            content: "Custom command created!",
            ephemeral: true,
          });
        }
      } catch (err) {
        console.error(err);
        await interaction.reply({
          content: "Something went wrong",
          ephemeral: true,
        });
      }
    },
  };