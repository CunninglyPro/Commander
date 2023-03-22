const { Interaction, EmbedBuilder } = require("discord.js");

module.exports = {
    name: 'interactionCreate',
    async execute(interaction, client) {
        if (!interaction.isCommand()) return;

        const command = client.commands.get(interaction.commandName);

        if (!command) return

        const errorEmbed = new EmbedBuilder()
        .setTitle(`<:alert:1082334164189184051> A fatal error occured!`)
        .setColor('Orange')
        .setDescription(`Please report the this issue using \`/bugreport\` command`)
        
        try{


            await command.execute(interaction, client);
        } catch (error) {
            console.log(error);
            await interaction.reply({
                embeds: [errorEmbed],
                ephemeral: true
            });
        } 

    },
    


};