const { SlashCommandBuilder, EmbedBuilder } = require('@discordjs/builders');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');

const rest = new REST({
    version: '9'
}).setToken(process.env.token);

module.exports = {
data: new SlashCommandBuilder()
    .setName('unregallcmd')
    .setDescription('Unregisters all the slash command from the bot.'),
async execute(interaction) {

    const embed = new EmbedBuilder()
    .setColor(12351)

    if (!(interaction.user.id === '728165261177257986')) {  
        return interaction.reply({embeds: [embed
            .setDescription(`<:cross:1082334173915775046> This command can be only executed by the developer.`)
            .setColor(724323)], ephemeral: true})
     }
    
    await rest.put(Routes.applicationCommands("950741813516464188"), { body: [] })
    .then(() => console.log('Successfully deleted all application commands.'))
    .catch(err => {
        console.log(err)
        interaction.editReply({embeds: [embed
        .setDescription(`<:cross:1082334173915775046> An error occured.\n\`\`\`${err}\`\`\``)
        .setColor(21873)]})
    });

    return interaction.reply({embeds: [embed.setDescription(`<:check:1082334169197187153> Successfully deleted all application commands.`)]})
    
    }
};